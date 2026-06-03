from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# 1. Password hashing system
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# hashing the password
def hash_password(password: str):
    if len(password) > 72:
        raise ValueError("Password too long (bcrypt max is 72 characters)")
    return pwd_context.hash(password)

# verifying the password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 2. JWT token system
def create_access_token(data: dict):
    to_encode = data.copy()

    # add expiration time to the token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # encode token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt