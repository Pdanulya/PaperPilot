from google import genai
from google.genai import errors
from app.core.config import GEMINI_API_KEY

client = genai.Client(
    api_key=GEMINI_API_KEY
)


def generate_summary(text: str, summary_type: str = "standard") -> str:

    summary_instructions = {
        "brief": """
- Keep the summary very concise.
- Give approximately 5-8 lines.
- Include only the most important points.
- Use a small number of key-point bullets.
""",

        "standard": """
- Give a balanced summary of approximately 10-15 lines.
- Include the main ideas and important details.
- Extract the key points as bullet points.
""",

        "detailed": """
- Provide a comprehensive and detailed summary.
- Cover all major sections, arguments, findings, and important details.
- For long documents, make the summary significantly longer than a standard summary.
- Organize the summary using clear headings and bullet points where appropriate.
- Do not omit important information merely to keep the summary short.
"""
    }

    instructions = summary_instructions.get(
        summary_type.lower(),
        summary_instructions["standard"]
    )

    prompt = f"""
You are an expert document analyst.

Summarize the following document according to the user's requested summary length.

Summary type: {summary_type}

Requirements:
{instructions}

General requirements:
- Keep the summary structured and easy to read.
- Base the summary ONLY on the provided document.
- Do NOT add external information.
- Do NOT invent facts.
- Preserve important names, numbers, findings, and conclusions when relevant.

Document:
{text}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    return response.text