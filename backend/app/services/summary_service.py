from google import genai
from app.core.config import GEMINI_API_KEY

client = genai.Client(
    api_key=GEMINI_API_KEY
)

def generate_summary(text: str) -> str:
    prompt = f"""
You are an expert document analyst.

Summarize the following document clearly and concisely.

Requirements:
- Provide a short summary (10-15 lines)
- Extract key points as bullet points
- Keep it simple and structured
- Do NOT add external information

Document:
{text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text