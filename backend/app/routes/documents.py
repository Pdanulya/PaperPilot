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
    # file_location = f"uploads/{file.filename}"

    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb") as buffer:
        buffer.write(file.file.read())

    document = Document(
        title=file.filename,
        file_type=extension,
        file_path=file_location,
        user_id=current_user.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)
        
    return {
        "id": document.id,
        "title": document.title,
        "file_type": document.file_type,
        "file_path": document.file_path,
        "uploaded_at": document.uploaded_at
    }