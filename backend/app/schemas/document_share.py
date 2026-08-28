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