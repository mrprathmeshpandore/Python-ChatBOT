from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    file_size: int
    storage_url: str
    status: str = "processing"

class DocumentCreate(DocumentBase):
    chat_id: Optional[str] = None

class DocumentUpdate(BaseModel):
    status: Optional[str] = None

class DocumentInDBBase(DocumentBase):
    id: str
    chat_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Document(DocumentInDBBase):
    pass
