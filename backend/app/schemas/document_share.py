from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Data we'll receive from the frontend.
class DocumentShareRequest(BaseModel):
    recipient_email: EmailStr

# What our API will return.
class DocumentShareResponse(BaseModel):
    message: str
    share_token: str
    share_url: str
    recipient_email: EmailStr

# Data we'll return when someone accesses a shared document.
class SharedDocumentResponse(BaseModel):
    document_id: int
    title: str
    file_type: str
    raw_text: Optional[str] = None
    summary: Optional[str] = None
    shared_with: EmailStr
    permission: str