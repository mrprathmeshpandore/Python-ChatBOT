from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.chat import Chat
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatUpdate, Chat as ChatSchema

router = APIRouter()

@router.get("/", response_model=List[ChatSchema])
async def read_chats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve all chats."""
    query = select(Chat).where(Chat.user_id == current_user.id).order_by(desc(Chat.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    chats = result.scalars().all()
    return chats

@router.post("/", response_model=ChatSchema, status_code=status.HTTP_201_CREATED)
async def create_chat(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    chat_in: ChatCreate,
) -> Any:
    """Create new chat."""
    chat = Chat(title=chat_in.title, user_id=current_user.id)
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat

@router.get("/{id}", response_model=ChatSchema)
async def read_chat(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    id: str,
) -> Any:
    """Get chat by ID."""
    result = await db.execute(select(Chat).where(Chat.id == id, Chat.user_id == current_user.id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.put("/{id}", response_model=ChatSchema)
async def update_chat(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    id: str,
    chat_in: ChatUpdate,
) -> Any:
    """Update a chat."""
    result = await db.execute(select(Chat).where(Chat.id == id, Chat.user_id == current_user.id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    update_data = chat_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(chat, field, value)
        
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat

@router.delete("/{id}")
async def delete_chat(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    id: str,
) -> Any:
    """Delete a chat."""
    result = await db.execute(select(Chat).where(Chat.id == id, Chat.user_id == current_user.id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    await db.delete(chat)
    await db.commit()
    return {"message": "Chat deleted successfully"}
