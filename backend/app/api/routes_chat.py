from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.core.bedrock_client import bedrock_chat

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    try:
        topic = payload.topic or "General"
        user_input = payload.user_input or None
        reply = bedrock_chat(topic_path=topic, user_input=user_input)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bedrock error: {e}")
