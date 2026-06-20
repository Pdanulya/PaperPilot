from pydantic import BaseModel, ConfigDict
from datetime import datetime

# What the API RETURNS (Schema filters it down)
class DocumentResponse(BaseModel):
    id: int
    title: str
    file_type: str
    file_path: str
    uploaded_at: datetime
    # user_id: int
    raw_text: str | None = None

    model_config = ConfigDict(from_attributes=True)