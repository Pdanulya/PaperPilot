from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import relationship
from app.db.base import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    # Which document this chat belongs to
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    # Which user sent it
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 'user' = question from user, 'assistant' = AI response, to reconstruct the conversation in order
    role = Column(String, nullable=False)

    content = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships — message.document and message.user
    document = relationship("Document", back_populates="chat_messages")
    user = relationship("User", back_populates="chat_messages")