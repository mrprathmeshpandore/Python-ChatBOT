from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    content: str
    metadata_: Optional[Dict[str, Any]] = None

class MessageCreate(MessageBase):
    chat_id: str

class MessageUpdate(BaseModel):
    content: Optional[str] = None
    metadata_: Optional[Dict[str, Any]] = None

class MessageInDBBase(MessageBase):
    id: str
    chat_id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Message(MessageInDBBase):
    pass
