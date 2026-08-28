import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.dependencies import get_current_user

from app.models.document import Document
from app.models.document_share import DocumentShare

from app.schemas.document_share import (
    DocumentShareRequest,
    DocumentShareResponse,
    SharedDocumentResponse
)

from app.services.email_service import send_document_share_email


router = APIRouter(
    prefix="/documents",
    tags=["Document Sharing"]
)

public_router = APIRouter(
    prefix="/shared",
    tags=["Shared Documents"]
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

    send_document_share_email(
        recipient_email=request.recipient_email,
        document_title=document.title,
        share_url=share_url
    )

    return DocumentShareResponse(
        message="Document shared successfully",
        share_token=share_token,
        share_url=share_url,
        recipient_email=request.recipient_email
    )

@public_router.get(
    "/{share_token}",
    response_model=SharedDocumentResponse
)
def get_shared_document(
    share_token: str,
    db: Session = Depends(get_db)
):
    # Find the share record using the secure token
    document_share = (
        db.query(DocumentShare)
        .filter(
            DocumentShare.share_token == share_token
        )
        .first()
    )

    if not document_share:
        raise HTTPException(
            status_code=404,
            detail="Shared document not found"
        )

    # Get the actual document
    document = (
        db.query(Document)
        .filter(
            Document.id == document_share.document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return SharedDocumentResponse(
        document_id=document.id,
        title=document.title,
        file_type=document.file_type,
        raw_text=document.raw_text,
        summary=document.summary,
        shared_with=document_share.recipient_email,
        permission=document_share.permission
    )