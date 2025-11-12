import json
import re
import boto3
from pathlib import Path
from botocore.exceptions import ClientError


AWS_REGION = "us-east-1"
BEDROCK_MODEL_ID = "openai.gpt-oss-120b-1:0"

client = boto3.client("bedrock-runtime", region_name=AWS_REGION)


# === Helper to load the correct system prompt ===
def load_system_prompt(language: str = "en") -> str:
    # Resolve caminho absoluto para o diretório /core/prompts
    base = Path(__file__).resolve().parent / "prompts"

    if language == "pt-BR":
        file_path = base / "system_prompt_ptbr.txt"
    else:
        file_path = base / "system_prompt_en.txt"

    if not file_path.exists():
        raise RuntimeError(f"System prompt file not found at {file_path}")

    with open(file_path, encoding="utf-8") as f:
        return f.read().strip()

# === Bedrock chat wrapper ===
def bedrock_chat(
    topic_path: str,
    user_input: str | None = None,
    language: str = "en",
    model_id: str | None = None,
) -> str:
    """Send a chat message to the Bedrock model using the correct system prompt."""
    model = model_id or BEDROCK_MODEL_ID
    system_prompt = load_system_prompt(language)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "assistant", "content": f"Current topic: {topic_path}"},
        {
            "role": "user",
            "content": user_input or f"Explain the topic: {topic_path}",
        },
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

    # Remove reasoning blocks if present
    reply = re.sub(r"<reasoning>.*?</reasoning>", "", reply, flags=re.DOTALL).strip()
    return reply
