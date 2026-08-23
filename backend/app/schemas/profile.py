from pydantic import BaseModel, EmailStr


class ProfileResponse(BaseModel):
    id: int
    name: str | None
    email: EmailStr
    created_at: object

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr