from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE: str | None = None
    API_DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()