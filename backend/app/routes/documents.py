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

from app.db.deps import get_db
from app.models.document import Document
from app.core.dependencies import get_current_user
from app.schemas.document import DocumentResponse

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
            
    document = Document(
        title=file.filename,
        file_type=extension,
        file_path=file_location,
        user_id=current_user.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)
        
    return DocumentResponse(
        id=document.id,
        title=document.title,
        file_type=document.file_type,
        file_path=document.file_path,
        uploaded_at=document.uploaded_at
    )

# This endpoint retrieves all documents uploaded by the authenticated user. It queries the database for documents associated with the user's ID and returns them as a list.   
@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    documents = db.query(Document)\
        .filter(Document.user_id == current_user.id)\
        .all()

    return documents

# This endpoint retrieves a specific document by its ID, but only if it belongs to the authenticated user. It checks the database for a document with the given ID and user ID, and returns it if found. If the document does not exist or does not belong to the user, it raises a 404 error.
@router.get("/{doc_id}")
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

@router.delete("/{doc_id}")
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

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}