from pydantic import BaseModel
from datetime import datetime
from typing import List

# What API json response looks like when we return chat history for a document
class ChatMessageResponse(BaseModel):
    id: int
    document_id: int
    user_id: int
    role: str # "user" or "assistant"
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# We want to return a list of messages for a document, along with total count for pagination 
class ChatHistoryResponse(BaseModel):
    document_id: int
    messages: List[ChatMessageResponse]
    # total count is useful for pagination 
    total: int