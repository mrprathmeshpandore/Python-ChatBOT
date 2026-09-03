import os
from google import genai
from app.core.config import settings

def get_genai_client(api_key: str = None) -> genai.Client:
    """
    Factory function to instantiate the official Google GenAI SDK Client.
    Completely replaces ChatGoogleGenerativeAI / LangChain wrapper.
    """
    final_api_key = api_key or os.getenv("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
    return genai.Client(api_key=final_api_key)
