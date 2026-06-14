from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SavedDocumentResponse(BaseModel):
    id: int
    document_id: int
    user_id: int
    saved_at: datetime

    # Nest basic document info so frontend doesn't need a second request
    document_title: Optional[str] = None
    document_file_type: Optional[str] = None

    class Config:
        from_attributes = True


class RecentlyOpenedResponse(BaseModel):
    document_id: int
    document_title: str
    document_file_type: str
    last_viewed_at: datetime

    class Config:
        from_attributes = True