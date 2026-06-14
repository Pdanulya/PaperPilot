from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.core.dependencies import get_current_user
from app.models.chat_message import ChatMessage
from app.models.document import Document
from app.schemas.chat_history import ChatHistoryResponse, ChatMessageResponse

router = APIRouter(prefix="/documents", tags=["Chat History"])


@router.get(
    "/{document_id}/history",
    response_model=ChatHistoryResponse
)
def get_chat_history(
    document_id: int,
    # Optional pagination — default returns latest 50 messages
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # First verify the document belongs to this user
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Get total count first — useful for frontend pagination
    total = db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id,
        ChatMessage.user_id == current_user.id
    ).count()

    # Fetch messages ordered oldest first so conversation reads naturally
    messages = db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id,
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc())\
     .offset(offset)\
     .limit(limit)\
     .all()

    return ChatHistoryResponse(
        document_id=document_id,
        messages=messages,
        total=total
    )


@router.delete(
    "/{document_id}/history"
)
def clear_chat_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify ownership
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Bulk delete all messages for this document by this user
    deleted = db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id,
        ChatMessage.user_id == current_user.id
    ).delete()

    db.commit()

    return {"message": f"Cleared {deleted} messages from chat history"}


@router.get(
    "/{document_id}/history/download",
    response_class=PlainTextResponse  
    # Returns plain text so browser can download it directly
)
def download_chat_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    messages = db.query(ChatMessage).filter(
        ChatMessage.document_id == document_id,
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc()).all()

    if not messages:
        raise HTTPException(status_code=404, detail="No chat history found")

    # Build a clean readable text file
    # Format:  [timestamp] You: ... / Assistant: ...
    lines = [f"Chat History — {document.title}\n{'='*50}\n"]

    for msg in messages:
        timestamp = msg.created_at.strftime("%Y-%m-%d %H:%M")
        speaker = "You" if msg.role == "user" else "Assistant"
        lines.append(f"[{timestamp}] {speaker}:\n{msg.content}\n")

    content = "\n".join(lines)

    # Tell the browser to treat this as a file download
    from fastapi.responses import Response
    return Response(
        content=content,
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename=chat_{document_id}.txt"
        }
    )