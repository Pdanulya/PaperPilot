from sqlalchemy import text

# This function retrieves the most relevant document chunks based on the provided query embedding.
def retrieve_relevant_chunks(
    db, # SQLAlchemy database session
    document_id,
    query_embedding, #vector created from user question
    limit=5 # How many chunks to retrieve.
):
    sql = text("""
        SELECT
            id,
            document_id,
            chunk_index,
            content
        FROM document_chunks
        WHERE document_id = :document_id
        ORDER BY embedding <=> :embedding
        LIMIT :limit
    """)

    result = db.execute(
        sql,
        {
            "document_id": document_id,
            "embedding": str(query_embedding),
            "limit": limit
        }
    )

    return result.fetchall()