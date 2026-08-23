from google import genai

from app.core.config import GEMINI_API_KEY

client = genai.Client(
    api_key=GEMINI_API_KEY
)

# This function generates an answer to a user's question based on the provided document context.
def generate_answer(
    question: str,
    context: str
):
    prompt = f"""
You are PaperPilot AI.

Answer ONLY using the provided document context.

If the answer is not present in the context,
say:

"Sorry, I couldn't find that information in the document."

Context:
{context}

Question:
{question}
"""
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    return response.text