from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime

from app.db.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_type = Column(String)
    file_path = Column(String)
    cloudinary_public_id = Column(String, nullable=True)  
    cloudinary_url = Column(String, nullable=True)
    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    raw_text = Column(Text, nullable=True) # To store extracted text from documents