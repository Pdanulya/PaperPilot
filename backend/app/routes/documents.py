from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)
import uuid
import os

from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.core.dependencies import get_current_user

from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.services.document_processor import extract_text

from app.models.chunk import DocumentChunk
from app.services.chunking_service import chunk_text

router = APIRouter(prefix="/documents", tags=["Documents"])

# This endpoint allows authenticated users to upload documents. It accepts a file, saves it to the server, and creates a corresponding entry in the database.
@router.post(
    "/upload",
    response_model=DocumentResponse
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    allowed_extensions = [".pdf", ".docx", ".txt"]

    if not any(
        file.filename.lower().endswith(ext)
        for ext in allowed_extensions
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, and TXT files are allowed"
        )
    
    extension = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{extension}"
    file_location = f"uploads/{unique_filename}"

    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb") as buffer:
        while chunk := file.file.read(1024 * 1024):
            buffer.write(chunk)

    try:
        raw_text = extract_text(file_location)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process document: {str(e)}"
        )

    # Create a new document row(entry/object) in the database       
    document = Document(
        title=file.filename,
        file_type=extension,
        file_path=file_location,
        raw_text=raw_text,
        user_id=current_user.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    chunks = chunk_text(raw_text)
    for chunk in chunks:
        # Create a new document chunk row(entry) in the database for each chunk of text
        document_chunk = DocumentChunk(
            document_id=document.id,
            chunk_index=chunk["index"],
            content=chunk["content"]
        )

        db.add(document_chunk)

    db.commit()
            
    return document

# This endpoint retrieves all documents uploaded by the authenticated user. It queries the database for documents associated with the user's ID and returns them as a list.   
@router.get(
    "/",
    response_model=List[DocumentResponse]
)
def get_documents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    documents = db.query(Document)\
        .filter(Document.user_id == current_user.id)\
        .all()

    return documents

# This endpoint retrieves a specific document by its ID, but only if it belongs to the authenticated user. It checks the database for a document with the given ID and user ID, and returns it if found.
@router.get(
    "/{doc_id}",
    response_model=DocumentResponse
)
def get_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = db.query(Document)\
        .filter(Document.id == doc_id,
                Document.user_id == current_user.id)\
        .first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document

# This endpoint allows the authenticated user to delete a specific document by its ID. It checks if the document exists and belongs to the user, and if so, it deletes the document from the database and returns a success message. 
@router.delete(
    "/{doc_id}"
)
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = db.query(Document)\
        .filter(Document.id == doc_id,
                Document.user_id == current_user.id)\
        .first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}
