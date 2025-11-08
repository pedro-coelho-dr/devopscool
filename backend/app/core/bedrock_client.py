import json
import re
import boto3
from botocore.exceptions import ClientError

SYSTEM_PROMPT = """
You are DevOpsCool, a mentor that provides clear and structured explanations about DevOps and Cloud Computing.

Your task:
- Explain the given topic or answer the user's question logically and concisely.
- Focus on the concept and its purpose, not examples or opinions.
- Always respond in the format below:

### Explanation
### Summary
### Next Steps
"""

AWS_REGION = "us-east-1"
BEDROCK_MODEL_ID = "openai.gpt-oss-120b-1:0"

client = boto3.client("bedrock-runtime", region_name=AWS_REGION)

def bedrock_chat(topic_path: str, user_input: str | None = None, model_id: str | None = None) -> str:
    model = BEDROCK_MODEL_ID

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": f"Current topic: {topic_path}"},
        {"role": "user", "content": user_input or f"Explain the topic: {topic_path}"}
    ]

    body = {
        "model": model,
        "messages": messages,
        "max_completion_tokens": 3000,
        "temperature": 0.65,
        "top_p": 0.9,
        "stream": False,
    }

    try:
        response = client.invoke_model(
            modelId=model,
            body=json.dumps(body),
            contentType="application/json",
            accept="application/json",
        )
    except ClientError as e:
        raise RuntimeError(f"Bedrock invocation failed for model {model}: {e}") from e

    raw = response["body"].read().decode("utf-8")
    result = json.loads(raw)

    try:
        reply = result["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError):
        reply = (
            result.get("completion")
            or result.get("results", [{}])[0].get("outputText")
        )
        if not reply:
            raise RuntimeError(f"Unexpected Bedrock response format: {result}")

    reply = re.sub(r"<reasoning>.*?</reasoning>", "", reply, flags=re.DOTALL).strip()
    return reply
