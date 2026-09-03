from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class ChatBase(BaseModel):
    title: str
    is_pinned: bool = False
    is_favorite: bool = False

class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ChatUpdate(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_favorite: Optional[bool] = None

class ChatInDBBase(ChatBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Chat(ChatInDBBase):
    pass
