from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)
import uuid
import os
import io

from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.core.dependencies import get_current_user

from app.models.document import Document
from app.models.chunk import DocumentChunk
from app.models.chat_message import ChatMessage

from app.schemas.document import DocumentResponse
from app.schemas.search import (SearchRequest, SearchResponse, ChunkResponse)
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.summary import SummaryResponse

from app.services.chunking_service import chunk_text
from app.services.embedding_service import get_embedding
from app.services.retrieval_service import retrieve_relevant_chunks
from app.services.rag_service import build_context
from app.services.llm_service import generate_answer
from app.services.summary_service import generate_summary
from app.services.document_processor import extract_text_from_bytes

from app.core.config import *   
from app.services.cloudinary_service import (upload_document_to_cloudinary, delete_document_from_cloudinary)

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

    # Read file bytes into memory — no local disk write needed
    file_bytes = file.file.read()

    # Extract text BEFORE uploading (works from bytes)
    try:
        raw_text = extract_text_from_bytes(file_bytes, extension)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process document: {str(e)}")

    # Upload to Cloudinary
    import uuid
    unique_name = f"{uuid.uuid4()}{extension}"
    cloudinary_result = upload_document_to_cloudinary(
        file_bytes,
        unique_name,
        current_user.id
    )

    # unique_filename = f"{uuid.uuid4()}{extension}"
    # file_location = f"uploads/{unique_filename}"

    # os.makedirs("uploads", exist_ok=True)
    # with open(file_location, "wb") as buffer:
    #     while chunk := file.file.read(1024 * 1024):
    #         buffer.write(chunk)

    # try:
    #     raw_text = extract_text(file_location)
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=400,
    #         detail=f"Failed to process document: {str(e)}"
    #     )

    try:
        # Create document
        document = Document(
            title=file.filename,
            file_type=extension,
            file_path=cloudinary_result["secure_url"],      
            cloudinary_public_id=cloudinary_result["public_id"],
            cloudinary_url=cloudinary_result["secure_url"],
            raw_text=raw_text,
            user_id=current_user.id
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        chunks = chunk_text(raw_text)

        db_chunk_objects = []

        for chunk in chunks:
            vector = get_embedding(chunk["content"])

            db_chunk_objects.append(
                DocumentChunk(
                    document_id=document.id,
                    chunk_index=chunk["index"],
                    content=chunk["content"],
                    embedding=vector
                )
            )

        db.add_all(db_chunk_objects)

        db.commit()

    except Exception as e:
        db.rollback()

        # Clean up Cloudinary upload if DB fails
        delete_document_from_cloudinary(cloudinary_result["public_id"])

        raise HTTPException(
            status_code=500,
            detail=f"Upload failed during processing: {str(e)}"
        )
            
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
    
    # 1. Delete chunks first (child records)
    db.query(DocumentChunk)\
        .filter(DocumentChunk.document_id == doc_id)\
        .delete()
    
    # 2. Delete from Cloudinary if it exists
    if document.cloudinary_public_id:
        delete_document_from_cloudinary(document.cloudinary_public_id)

    # if os.path.exists(document.file_path):
    #     os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}


@router.post(
        "/{document_id}/search",
        response_model=SearchResponse
    )
def search_document(
    document_id: int,
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify the document user request exists and belongs to that user
    # SELECT * FROM documents
    # WHERE id = document_id
    # AND user_id = current_user.id
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Convert user question to embedding vector
    query_embedding = get_embedding(request.query)

    # search only the requested document and retrieve relevant chunks 
    relevant_chunks = retrieve_relevant_chunks(
        db,
        document_id,
        query_embedding,
        limit=5
    )

    # Return the search results as a list of chunks with their content and IDs. The chunks are ordered by relevance based on the distance between their embeddings and the query embedding.
    return SearchResponse(
        chunks=[
            ChunkResponse(
                id=chunk.id,
                content=chunk.content
            )
            for chunk in relevant_chunks
        ]
    )

@router.post(
    "/{document_id}/chat",
    response_model=ChatResponse
)
def chat_with_document(
    document_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    
    query_embedding = get_embedding(request.query)

    chunks = retrieve_relevant_chunks(
        db,
        document_id,
        query_embedding,
        limit=5
    )

    # Build a human-readable context string from the retrieved chunks to provide to the LLM. 
    context = build_context(chunks)

    answer = generate_answer(
        request.query,
        context
    )

    # ---- Save both sides of the conversation ----

    # Save the user's question first
    user_message = ChatMessage(
        document_id=document_id,
        user_id=current_user.id,
        role="user",
        content=request.query
    )
    db.add(user_message)

    # Save the AI's answer immediately after
    assistant_message = ChatMessage(
        document_id=document_id,
        user_id=current_user.id,
        role="assistant",
        content=answer
    )
    db.add(assistant_message)

    # Commit both in one transaction — either both save or neither does
    db.commit()

    # ---- END ----

    return ChatResponse(answer=answer)

@router.post(
    "/{document_id}/summary",
    response_model=SummaryResponse
)
def generate_document_summary(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    
    summary_text = generate_summary(document.raw_text)

    return SummaryResponse(
    document_id=document_id,
    summary=summary_text
)