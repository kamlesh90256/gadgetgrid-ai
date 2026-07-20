import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_llm(query: str, context: str):
    prompt = f"""
You are an AI shopping assistant.

Use ONLY the product information below.

If the answer is not present in the product information, clearly say:
"I couldn't find that information in the available products."

Product Information:
{context}

User Question:
{query}

Answer:
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    return response.text