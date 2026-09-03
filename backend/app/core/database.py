from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Use PostgreSQL for Production Scalability. 
# Defaults to a local postgres instance if DATABASE_URL is not set.
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL if hasattr(settings, 'DATABASE_URL') and settings.DATABASE_URL else "postgresql+asyncpg://postgres:postgres@localhost:5432/chatbot"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    future=True,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True, # Verify connections before usage
)

async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False, autoflush=False
)

from sqlalchemy import MetaData

naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

Base = declarative_base(metadata=MetaData(naming_convention=naming_convention))

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
