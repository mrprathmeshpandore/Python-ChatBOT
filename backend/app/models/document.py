from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Integer
from app.models.base import BaseModel
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from app.models.chat import Chat
    from app.models.chunk import Chunk
    from app.models.user import User

class Document(BaseModel):
    __tablename__ = "documents"

    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    chat_id: Mapped[str] = mapped_column(ForeignKey("chats.id", ondelete="SET NULL"), nullable=True, index=True)
    
    filename: Mapped[str] = mapped_column(String, nullable=False)
    file_type: Mapped[str] = mapped_column(String, nullable=False) # pdf, docx, txt, etc.
    file_size: Mapped[int] = mapped_column(Integer, nullable=False) # in bytes
    storage_url: Mapped[str] = mapped_column(String, nullable=False) # URL in object storage
    status: Mapped[str] = mapped_column(String, default="processing") # processing, ready, failed

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="documents")
    chat: Mapped["Chat"] = relationship("Chat", back_populates="documents")
    chunks: Mapped[List["Chunk"]] = relationship("Chunk", back_populates="document", cascade="all, delete-orphan")
