import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.dependencies import get_current_user

from app.models.document import Document
from app.models.document_share import DocumentShare

from app.schemas.document_share import (
    DocumentShareRequest,
    DocumentShareResponse
)


router = APIRouter(
    prefix="/documents",
    tags=["Document Sharing"]
)

@router.post(
    "/{document_id}/share",
    response_model=DocumentShareResponse
)
def share_document(
    document_id: int,
    request: DocumentShareRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 1. Verify that the document belongs to the logged-in user
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # 2. Generate a secure random token
    share_token = secrets.token_urlsafe(32)

    # 3. Create the share record
    document_share = DocumentShare(
        document_id=document.id,
        owner_id=current_user.id,
        recipient_email=request.recipient_email,
        share_token=share_token,
        permission="view"
    )

    # 4. Save to database
    db.add(document_share)
    db.commit()
    db.refresh(document_share)

    # 5. Create the URL that will eventually be sent by email
    share_url = f"http://localhost:5173/shared/{share_token}"

    return DocumentShareResponse(
        message="Document shared successfully",
        share_token=share_token,
        share_url=share_url,
        recipient_email=request.recipient_email
    )