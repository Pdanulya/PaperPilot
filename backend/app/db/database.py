from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import DATABASE_URL

# 1. Create database engine (connection to PostgreSQL db)
engine = create_engine(DATABASE_URL)

# 2. Create a session maker (for creating database sessions)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 3. Create a base model(parent class for all db tables)
Base = declarative_base()