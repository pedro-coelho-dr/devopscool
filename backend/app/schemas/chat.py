from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    topic: str
    user_input: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
