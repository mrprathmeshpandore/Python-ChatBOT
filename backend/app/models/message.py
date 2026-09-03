from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Text, JSON
from app.models.base import BaseModel
from typing import TYPE_CHECKING, Dict, Any, Optional

if TYPE_CHECKING:
    from app.models.chat import Chat

class Message(BaseModel):
    __tablename__ = "messages"

    chat_id: Mapped[str] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String, nullable=False) # "user", "assistant", "system"
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Optional metadata (e.g., source citations, confidence score)
    metadata_: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Relationships
    chat: Mapped["Chat"] = relationship("Chat", back_populates="messages")
