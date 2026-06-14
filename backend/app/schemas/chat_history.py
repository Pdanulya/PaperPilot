from pydantic import BaseModel
from datetime import datetime
from typing import List

class ChatMessageResponse(BaseModel):
    id: int
    document_id: int
    user_id: int
    role: str # "user" or "assistant"
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    document_id: int
    messages: List[ChatMessageResponse]
    # total count is useful for pagination later
    total: int