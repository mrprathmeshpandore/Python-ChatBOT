from fastapi import APIRouter
from app.api.routers import chats, messages, documents, rag, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])
