from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session

from app.core.config import SECRET_KEY, ALGORITHM
from app.db.deps import get_db
from app.models.user import User

# FastAPI will automatically look for token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Dependency to get the current user from the token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except ExpiredSignatureError as e:
        print("❌ TOKEN EXPIRED ERROR:", str(e))
        raise HTTPException(
            status_code=401,
            detail="Token expired"
        )

    except JWTError as e:
        print("❌ JWT ERROR DETAILS:", str(e))
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )