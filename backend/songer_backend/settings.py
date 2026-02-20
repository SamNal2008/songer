"""Application settings."""

from __future__ import annotations

from typing import List

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application settings."""
    
    # API settings
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    reload: bool = Field(default=False, env="RELOAD")
    
    # CORS settings
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        env="CORS_ORIGINS",
    )
    
    # Supabase settings
    supabase_url: str = Field(..., env="SUPABASE_URL")
    supabase_anon_key: str = Field(..., env="SUPABASE_ANON_KEY")
    supabase_service_key: str = Field(..., env="SUPABASE_SERVICE_KEY")
    
    # Security
    secret_key: str = Field(..., env="BACKEND_SECRET_KEY")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
