from groq import Groq
from providers import LLMProvider
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

class GroqProvider(LLMProvider):

    def generate(self, message: str):

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        return response.choices[0].message.content