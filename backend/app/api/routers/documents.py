from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import uuid
import os

from app.core.database import get_db
from app.models.chat import Chat
from app.models.document import Document
from app.schemas.document import Document as DocumentSchema
from app.api.routers.rag import process_document_sync

router = APIRouter()

# Directory for local storage fallback (In a real app, use S3/Supabase)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[DocumentSchema])
async def read_documents(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    chat_id: str = None,
) -> Any:
    """Retrieve all documents."""
    query = select(Document)
    if chat_id:
        query = query.where(Document.chat_id == chat_id)
    
    query = query.order_by(desc(Document.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    documents = result.scalars().all()
    return documents

@router.post("/upload", response_model=DocumentSchema, status_code=status.HTTP_201_CREATED)
async def upload_document(
    *,
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
    chat_id: str = Form(None),
    background_tasks: BackgroundTasks,
) -> Any:
    """Upload a new document."""
    if chat_id:
        # Verify chat exists
        result = await db.execute(select(Chat).where(Chat.id == chat_id))
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Chat not found")

    file_extension = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    
    # Save file locally
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.{file_extension}")
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        file_size = len(content)
        
    doc = Document(
        chat_id=chat_id,
        filename=file.filename,
        file_type=file_extension,
        file_size=file_size,
        storage_url=file_path, # URL or Path
        status="processing"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
    # Process document in background using FastAPI BackgroundTasks instead of Celery
    # We will need to define a local processor or import it
    from app.core.database import async_session_maker
    
    async def process_doc_bg(doc_id: str):
        async with async_session_maker() as session:
            await process_document_sync(doc_id, session)
            
    background_tasks.add_task(process_doc_bg, doc.id)
    
    return doc

@router.delete("/{id}")
async def delete_document(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
) -> Any:
    """Delete a document."""
    result = await db.execute(select(Document).where(Document.id == id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete file from storage
    if os.path.exists(doc.storage_url):
        os.remove(doc.storage_url)
        
    await db.delete(doc)
    await db.commit()
    return {"message": "Document deleted successfully"}
