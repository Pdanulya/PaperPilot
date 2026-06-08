from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text
)
from app.db.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        nullable=False
    )

    chunk_index = Column(
        Integer,
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

# How chunks are structured in the database:
# document_chunks
# ├── id=1
# ├── document_id=1
# ├── chunk_index=0

# document_chunks
# ├── id=2
# ├── document_id=1
# ├── chunk_index=1