from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str


class ChunkResponse(BaseModel):
    id: int
    content: str


class SearchResponse(BaseModel):
    chunks: list[ChunkResponse]