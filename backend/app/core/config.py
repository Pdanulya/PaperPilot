import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

B2_ENDPOINT_URL = os.getenv("B2_ENDPOINT_URL")
B2_ACCESS_KEY_ID = os.getenv("B2_ACCESS_KEY_ID")
B2_SECRET_ACCESS_KEY = os.getenv("B2_SECRET_ACCESS_KEY")
B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME")
B2_REGION = os.getenv("B2_REGION")