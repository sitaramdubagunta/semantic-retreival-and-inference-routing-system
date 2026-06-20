from google import genai
from dotenv import load_dotenv
import os

from providers import LLMProvider

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

class GeminiProvider(LLMProvider):

    def generate(self, message: str):

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=message,
        )

        return response.text