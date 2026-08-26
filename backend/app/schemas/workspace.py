from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.document import DocumentResponse

class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class WorkspaceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WorkspaceDetailResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    documents: list[DocumentResponse]

    class Config:
        from_attributes = True