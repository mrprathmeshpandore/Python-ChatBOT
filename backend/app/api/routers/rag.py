from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc
import os
from app.core.database import get_db
from app.core.config import settings
from app.models.chat import Chat
from app.models.message import Message
from app.schemas.message import MessageCreate
from app.services.rag_service import rag_service

router = APIRouter()

async def process_document_sync(document_id: str, db: AsyncSession):
    await rag_service.process_document(db, document_id)

@router.post("/chat/{chat_id}/stream")
async def stream_chat_response(
    chat_id: str,
    message_in: MessageCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Stream AI response using RAG."""
    # Verify chat exists
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Save User Message
    user_msg = Message(
        chat_id=chat_id,
        role="user",
        content=message_in.content
    )
    db.add(user_msg)
    await db.commit()

    # Get Chat History
    hist_result = await db.execute(
        select(Message).where(Message.chat_id == chat_id).order_by(asc(Message.created_at))
    )
    chat_history = hist_result.scalars().all()

    # Hardcoded default settings for clean MVP
    # Use settings instead of os.getenv to avoid stale env vars from hot-reloads
    model_provider = settings.MODEL_PROVIDER
    model_name = settings.GEMINI_MODEL
    temperature = 0.7
    web_search_enabled = False

    # Create Generator
    async def response_generator():
        import json
        full_response = ""
        sources_metadata = []
        
        try:
            async for chunk_data in rag_service.generate_response_stream(
                db=db, 
                chat_id=chat_id, 
                query=message_in.content, 
                chat_history=chat_history,
                web_search_enabled=web_search_enabled,
                model_name=model_name,
                model_provider=model_provider,
                temperature=temperature,
                summary=chat.summary
            ):
                print(f"[ROUTER STREAMING CHUNK]: {chunk_data}")
                if chunk_data['type'] == 'content':
                    full_response += chunk_data['text']
                elif chunk_data['type'] == 'sources':
                    sources_metadata = chunk_data['data']
                    
                # Format as SSE
                yield f"data: {json.dumps(chunk_data)}\n\n"
                
        except Exception as e:
            import traceback
            print("=== EXCEPTION IN response_generator (BEFORE STREAMINGRESPONSE ENDS) ===")
            traceback.print_exc()
            print("EXCEPTION DETAILS:", e)
            print("=========================================================================")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
            return
            
        # Save AI Message after response generation completes
        try:
            ai_msg = Message(
                chat_id=chat_id,
                role="assistant",
                content=full_response,
                metadata_={"sources": sources_metadata} if sources_metadata else None
            )
            db.add(ai_msg)
            await db.commit()
        except Exception as db_err:
            import traceback
            print("[ROUTER] Primary DB session failed on save_ai_msg, using fresh async_session_maker:")
            traceback.print_exc()
            from app.core.database import async_session_maker
            async with async_session_maker() as fresh_db:
                ai_msg = Message(
                    chat_id=chat_id,
                    role="assistant",
                    content=full_response,
                    metadata_={"sources": sources_metadata} if sources_metadata else None
                )
                fresh_db.add(ai_msg)
                await fresh_db.commit()
        
        # Schedule memory summarization if conversation is long
        if len(chat_history) > 10:
            background_tasks.add_task(
                rag_service.summarize_conversation,
                chat_id=chat_id,
                model_provider=model_provider,
                model_name=model_name
            )

    return StreamingResponse(response_generator(), media_type="text/event-stream")
