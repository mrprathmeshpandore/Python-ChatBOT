from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Text
from app.models.base import BaseModel
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from app.models.chat import Chat
    from app.models.document import Document

class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    picture: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(String, unique=True, index=True, nullable=True)
    
    # Relationships
    chats: Mapped[List["Chat"]] = relationship("Chat", back_populates="user", cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="user", cascade="all, delete-orphan")
