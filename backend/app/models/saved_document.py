from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base

class SavedDocument(Base):
    __tablename__ = "saved_documents"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="saved_documents")
    document = relationship("Document", back_populates="saved_by")

    # Prevents the same user saving the same document twice
    # Instead of checking in code, the DB enforces it at constraint level
    __table_args__ = (
        UniqueConstraint("user_id", "document_id", name="unique_user_saved_doc"),
    )