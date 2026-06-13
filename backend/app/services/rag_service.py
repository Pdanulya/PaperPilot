def build_context(chunks):
    context_parts = []

    for chunk in chunks:
        context_parts.append(
            f"""
            Chunk {chunk.chunk_index}
            {chunk.content}
            """
        )

    return "\n\n".join(context_parts) 
    # Combine all chunk contents into a single context string instead of an array, separating them with two newlines for readability.
    # Gemini needs human readable context.