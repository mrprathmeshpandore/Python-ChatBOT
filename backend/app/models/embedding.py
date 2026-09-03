from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, JSON
from app.models.base import BaseModel
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.models.chunk import Chunk

from pgvector.sqlalchemy import Vector

class Embedding(BaseModel):
    __tablename__ = "embeddings"

    chunk_id: Mapped[str] = mapped_column(ForeignKey("chunks.id", ondelete="CASCADE"), unique=True, index=True)
    
    # Store the 768-d vector using pgvector native type (Gemini text-embedding-004 size)
    vector: Mapped[Any] = mapped_column(Vector(3072), nullable=False)

    # Relationships
    chunk: Mapped["Chunk"] = relationship("Chunk", back_populates="embedding")
