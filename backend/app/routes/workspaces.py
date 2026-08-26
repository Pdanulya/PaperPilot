from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.core.dependencies import get_current_user
from app.models.workspace import Workspace
from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse
)
from app.models.document import Document

router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"]
)

@router.post(
    "/",
    response_model=WorkspaceResponse
)
def create_workspace(
    request: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    workspace = Workspace(
        name=request.name,
        description=request.description,
        user_id=current_user.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace

# Get all workspace for the logged in user
@router.get(
    "/",
    response_model=List[WorkspaceResponse]
)
def get_workspaces(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    workspaces = (
        db.query(Workspace)
        .filter(
            Workspace.user_id == current_user.id
        )
        .order_by(
            Workspace.created_at.desc()
        )
        .all()
    )
    return workspaces

# Get one workspace
@router.get(
    "/{workspace_id}",
    response_model=WorkspaceResponse
)
def get_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id
        )
        .first()
    )
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
    return workspace

# Update workspace
@router.put(
    "/{workspace_id}",
    response_model=WorkspaceResponse
)
def update_workspace(
    workspace_id: int,
    request: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id
        )
        .first()
    )
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
    if request.name is not None:
        workspace.name = request.name
    if request.description is not None:
        workspace.description = request.description

    db.commit()
    db.refresh(workspace)
    return workspace

# Delete workspace (soft delete. documents still in db)
@router.delete(
    "/{workspace_id}"
)
def delete_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id
        )
        .first()
    )
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
    db.delete(workspace)
    db.commit()
    return {
        "message": "Workspace deleted successfully"
    }

# Add documents to a workspace
@router.post(
    "/{workspace_id}/documents/{document_id}"
)
def add_document_to_workspace(
    workspace_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id
        )
        .first()
    )
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
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
    if document in workspace.documents:
        raise HTTPException(
            status_code=400,
            detail="Document already exists in this workspace"
        )
    workspace.documents.append(document)
    db.commit()
    return {
        "message": "Document added to workspace"
    }

# Remove document from a workspace
@router.delete(
    "/{workspace_id}/documents/{document_id}"
)
def remove_document_from_workspace(
    workspace_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id
        )
        .first()
    )
    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )
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
    if document not in workspace.documents:
        raise HTTPException(
            status_code=400,
            detail="Document is not in this workspace"
        )
    workspace.documents.remove(document)
    db.commit()
    return {
        "message": "Document removed from workspace"
    }