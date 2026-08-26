from sqlalchemy import Table, Column, Integer, ForeignKey

from app.db.database import Base


workspace_documents = Table(
    "workspace_documents",
    Base.metadata,

    Column(
        "workspace_id",
        Integer,
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        primary_key=True
    ),

    Column(
        "document_id",
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        primary_key=True
    )
)