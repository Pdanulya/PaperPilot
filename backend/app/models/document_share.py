from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from app.db.database import Base


class DocumentShare(Base):
    __tablename__ = "document_shares"

    id = Column(Integer, primary_key=True, index=True)

    # The document being shared
    document_id = Column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False
    )

    # The owner who created the share
    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Person receiving the document
    recipient_email = Column(
        String,
        nullable=False
    )

    # Random secure token used in the sharing URL
    share_token = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    # Currently we only support view access
    permission = Column(
        String,
        nullable=False,
        default="view"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    expires_at = Column(
        DateTime,
        nullable=True
    )