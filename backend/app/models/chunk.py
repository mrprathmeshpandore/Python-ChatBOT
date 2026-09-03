from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Text, Integer, JSON
from app.models.base import BaseModel
from typing import TYPE_CHECKING, Dict, Any, Optional

if TYPE_CHECKING:
    from app.models.document import Document
    from app.models.embedding import Embedding

class Chunk(BaseModel):
    __tablename__ = "chunks"

    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True) # Page number, section, etc.

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="chunks")
    embedding: Mapped[Optional["Embedding"]] = relationship("Embedding", back_populates="chunk", uselist=False, cascade="all, delete-orphan")
