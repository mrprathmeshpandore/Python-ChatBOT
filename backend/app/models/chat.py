from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.base import BaseModel
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from app.models.message import Message
    from app.models.document import Document
    from app.models.user import User

class Chat(BaseModel):
    __tablename__ = "chats"

    title: Mapped[str] = mapped_column(String, nullable=False, default="New Chat")
    is_pinned: Mapped[bool] = mapped_column(default=False)
    is_favorite: Mapped[bool] = mapped_column(default=False)
    
    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    
    # AI Memory Summary
    from sqlalchemy import Text
    summary: Mapped[str] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="chats")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="chat", cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="chat")
