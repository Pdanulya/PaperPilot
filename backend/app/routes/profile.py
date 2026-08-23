from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get(
    "/",
    response_model=ProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put(
    "/",
    response_model=ProfileResponse
)
def update_profile(
    request: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Check whether another account already uses this email
    existing_user = (
        db.query(User)
        .filter(
            User.email == request.email,
            User.id != current_user.id
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="This email is already in use."
        )

    current_user.name = request.name
    current_user.email = request.email

    db.commit()
    db.refresh(current_user)

    return current_user