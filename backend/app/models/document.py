from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.db.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_type = Column(String)
    file_path = Column(String)
    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )