import os
from dotenv import load_dotenv
load_dotenv()
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Knowledge Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Gemini API
    GOOGLE_API_KEY: str
    MODEL_PROVIDER: str = "gemini"
    GEMINI_MODEL: str = "gemini-3.6-flash"
    
    # Remote Embeddings
    EMBEDDING_MODEL: str = "models/gemini-embedding-001"
    
    # Debug / Feature flags
    ENABLE_STREAMING: bool = False
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

settings = Settings()
