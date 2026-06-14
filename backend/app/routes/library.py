from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.db.deps import get_db
from app.core.dependencies import get_current_user
from app.models.saved_document import SavedDocument
from app.models.document_view import DocumentView
from app.models.document import Document
from app.schemas.saved import SavedDocumentResponse, RecentlyOpenedResponse

router = APIRouter(prefix="/library", tags=["Library"])


# ─── SAVED DOCUMENTS ────────────────────────────────────────────

@router.post("/save/{document_id}")
def save_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify document exists and belongs to user
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Check if already saved — return friendly message instead of DB error
    already_saved = db.query(SavedDocument).filter(
        SavedDocument.document_id == document_id,
        SavedDocument.user_id == current_user.id
    ).first()

    if already_saved:
        raise HTTPException(status_code=400, detail="Document already saved")

    saved = SavedDocument(
        document_id=document_id,
        user_id=current_user.id
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)

    return {"message": "Document saved successfully", "saved_id": saved.id}


@router.delete("/save/{document_id}")
def unsave_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    saved = db.query(SavedDocument).filter(
        SavedDocument.document_id == document_id,
        SavedDocument.user_id == current_user.id
    ).first()

    if not saved:
        raise HTTPException(status_code=404, detail="Document not in saved list")

    db.delete(saved)
    db.commit()

    return {"message": "Document removed from saved"}


@router.get("/saved", response_model=List[SavedDocumentResponse])
def get_saved_documents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    saved_records = db.query(SavedDocument).filter(
        SavedDocument.user_id == current_user.id
    # Most recently saved appears first
    ).order_by(SavedDocument.saved_at.desc()).all()

    # Manually attach document info to each record
    # so the frontend gets title + file_type without a second API call
    results = []
    for record in saved_records:
        record.document_title = record.document.title
        record.document_file_type = record.document.file_type
        results.append(record)

    return results


# ─── RECENTLY OPENED ────────────────────────────────────────────

@router.get("/recent", response_model=List[RecentlyOpenedResponse])
def get_recently_opened(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get the 10 most recently viewed documents
    # Join with Document table to get title and file_type in one query
    recent = (
        db.query(DocumentView)
        .join(Document, Document.id == DocumentView.document_id)
        .filter(DocumentView.user_id == current_user.id)
        .order_by(DocumentView.last_viewed_at.desc())
        .limit(10)
        .all()
    )

    # Build response manually to include document details
    return [
        RecentlyOpenedResponse(
            document_id=view.document_id,
            document_title=view.document.title,
            document_file_type=view.document.file_type,
            last_viewed_at=view.last_viewed_at
        )
        for view in recent
    ]


# ─── DASHBOARD SUMMARY ──────────────────────────────────────────

@router.get("/dashboard")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Total documents uploaded by user
    total_docs = db.query(Document).filter(
        Document.user_id == current_user.id
    ).count()

    # Total saved documents
    total_saved = db.query(SavedDocument).filter(
        SavedDocument.user_id == current_user.id
    ).count()

    # Total chat messages sent by user across all documents
    from app.models.chat_message import ChatMessage
    total_chats = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.role == "user"  # count questions not AI replies
    ).count()

    # Last 5 recently opened for dashboard preview
    recent = (
        db.query(DocumentView)
        .join(Document, Document.id == DocumentView.document_id)
        .filter(DocumentView.user_id == current_user.id)
        .order_by(DocumentView.last_viewed_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_documents": total_docs,
        "total_saved": total_saved,
        "total_chats_sent": total_chats,
        "recently_opened": [
            {
                "document_id": v.document_id,
                "title": v.document.title,
                "last_viewed_at": v.last_viewed_at
            }
            for v in recent
        ]
    }