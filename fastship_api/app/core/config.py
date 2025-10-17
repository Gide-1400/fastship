from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "FastShip API"
    environment: str = "development"
    database_url: str = "sqlite:///./fastship.db"

    class Config:
        env_file = ".env"
        env_prefix = ""


settings = Settings()