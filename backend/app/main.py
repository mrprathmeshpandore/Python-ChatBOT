import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.api.api import api_router

from contextlib import asynccontextmanager
from app.core.database import engine, Base
import traceback
from sqlalchemy import text
from app.core.logging import logger

import httpx

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB (in production use Alembic, but for now we create_all)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    logger.info("Application startup: DB initialized.")
    
    yield
    logger.info("Application shutdown completed.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Add GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the AI Knowledge Assistant API"}

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    health_status = {
        "backend": "healthy",
        "database": "unknown",
        "chat_model": settings.GEMINI_MODEL,
        "embedding_model": settings.EMBEDDING_MODEL,
    }
    
    # Check DB
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception:
        health_status["database"] = "disconnected"
        
    return health_status

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Exception on {request.url}: {traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
