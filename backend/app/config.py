from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model_name: str = os.getenv("OPENAI_MODEL_NAME", "gpt-4-turbo-preview")
    
    # Evolution API
    evolution_api_url: str = os.getenv("EVOLUTION_API_URL", "http://localhost:8080")
    evolution_api_key: str = os.getenv("EVOLUTION_API_KEY", "")
    
    # Firebase (se estiver usando)
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID", "")
    firebase_private_key: str = os.getenv("FIREBASE_PRIVATE_KEY", "")
    firebase_client_email: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    
    # Server
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "127.0.0.1")

@lru_cache()
def get_settings() -> Settings:
    return Settings() 