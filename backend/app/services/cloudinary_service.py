import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import HTTPException

from app.core.config import (
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
)

# Initialize Cloudinary with credentials
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)

def upload_document_to_cloudinary(
    file_bytes: bytes,
    filename: str,
    user_id: int
) -> dict:
    """Upload a document file to Cloudinary and return the result."""
    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            resource_type="raw",       # 'raw' for non-image files (PDF, DOCX, TXT)
            folder=f"paperpilot/users/{user_id}/documents",
            public_id=filename,
            use_filename=True,
            unique_filename=True,
            overwrite=False,
            tags=[f"user_{user_id}", "document"]
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {str(e)}"
        )

def delete_document_from_cloudinary(public_id: str) -> dict:
    """Delete a document from Cloudinary by its public_id."""
    try:
        result = cloudinary.api.delete_resources(
            [public_id],
            resource_type="raw"
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary deletion failed: {str(e)}"
        )

def get_document_url(public_id: str) -> str:
    """Generate a secure URL for a Cloudinary document."""
    from cloudinary.utils import cloudinary_url
    url, _ = cloudinary_url(public_id, resource_type="raw", secure=True)
    return url