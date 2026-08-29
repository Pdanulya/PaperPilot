from pydantic import BaseModel
from typing import Literal


class SummaryRequest(BaseModel):
    summary_type: Literal["brief", "standard", "detailed"] = "standard"


class SummaryResponse(BaseModel):
    document_id: int
    summary: str