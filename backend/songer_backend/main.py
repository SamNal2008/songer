"""FastAPI main application for Songer backend."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from songer_backend.routers import health
from songer_backend.settings import Settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan events."""
    # Startup
    yield
    # Shutdown


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = Settings()
    
    app = FastAPI(
        title="Songer Backend API",
        description="Backend API for hum-to-search service",
        version="0.1.0",
        lifespan=lifespan,
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(health.router, prefix="/api", tags=["health"])
    
    return app


app = create_app()


def main() -> None:
    """Entry point for the application."""
    import uvicorn
    
    settings = Settings()
    uvicorn.run(
        "songer_backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
    )


if __name__ == "__main__":
    main()
