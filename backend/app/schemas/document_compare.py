from pydantic import BaseModel, Field
from typing import List


class CompareRequest(BaseModel):
    document_ids: List[int] = Field(
        ...,
        min_length=2,
        description="At least two document IDs are required"
    )
    query: str


class CompareResponse(BaseModel):
    answer: str