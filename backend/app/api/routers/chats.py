from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.api.deps import get_current_user_optional
from app.models.chat import Chat
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatUpdate, Chat as ChatSchema

router = APIRouter()

@router.get("/", response_model=List[ChatSchema])
async def read_chats(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve chats for the authenticated user only. Return empty list if not logged in."""
    if not current_user:
        return []

    query = (
        select(Chat)
        .where(Chat.user_id == current_user.id)
        .order_by(desc(Chat.created_at))
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(query)
    chats = result.scalars().all()
    return chats

@router.post("/", response_model=ChatSchema, status_code=status.HTTP_201_CREATED)
async def create_chat(
    *,
    db: AsyncSession = Depends(get_db),
    chat_in: ChatCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> Any:
    """Create new chat associated with the logged in user."""
    user_id = current_user.id if current_user else None
    chat = Chat(title=chat_in.title, user_id=user_id)
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat

@router.get("/{id}", response_model=ChatSchema)
async def read_chat(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> Any:
    """Get chat by ID with ownership verification."""
    result = await db.execute(select(Chat).where(Chat.id == id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    if chat.user_id is not None:
        if not current_user or chat.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this chat")

    return chat

@router.put("/{id}", response_model=ChatSchema)
async def update_chat(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    chat_in: ChatUpdate,
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> Any:
    """Update a chat with ownership verification."""
    result = await db.execute(select(Chat).where(Chat.id == id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat.user_id is not None:
        if not current_user or chat.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to modify this chat")
    
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
    id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> Any:
    """Delete a chat with ownership verification."""
    result = await db.execute(select(Chat).where(Chat.id == id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat.user_id is not None:
        if not current_user or chat.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this chat")
        
    await db.delete(chat)
    await db.commit()
    return {"message": "Chat deleted successfully"}

