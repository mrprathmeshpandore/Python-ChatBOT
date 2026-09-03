from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.chat import Chat
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate, Message as MessageSchema

router = APIRouter()

@router.get("/{chat_id}", response_model=List[MessageSchema])
async def read_messages(
    chat_id: str,
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve messages for a specific chat."""
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    query = select(Message).where(Message.chat_id == chat_id).order_by(asc(Message.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    messages = result.scalars().all()
    return messages

@router.post("/", response_model=MessageSchema, status_code=status.HTTP_201_CREATED)
async def create_message(
    *,
    db: AsyncSession = Depends(get_db),
    message_in: MessageCreate,
) -> Any:
    """Create new message."""
    result = await db.execute(select(Chat).where(Chat.id == message_in.chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    message = Message(
        chat_id=message_in.chat_id,
        role=message_in.role,
        content=message_in.content,
        metadata_=message_in.metadata_
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message
