from sqlalchemy import text

# This function retrieves the most relevant document chunks based on the provided query embedding.
def retrieve_relevant_chunks(
    db,
    query_embedding,
    limit=5
):
    sql = text("""
        SELECT
            id,
            document_id,
            chunk_index,
            content
        FROM document_chunks
        ORDER BY embedding <=> :embedding
        LIMIT :limit
    """)

    result = db.execute(
        sql,
        {
            "embedding": str(query_embedding),
            "limit": limit
        }
    )

    return result.fetchall()