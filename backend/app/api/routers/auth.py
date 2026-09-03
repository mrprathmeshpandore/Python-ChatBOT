from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from google.oauth2 import id_token
from google.auth.transport import requests
import httpx

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter()

class GoogleAuthRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/google", response_model=TokenResponse)
async def google_auth(request: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    try:
        # Verify the Google access token by getting user info
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {request.token}"}
            )
            if response.status_code != 200:
                raise ValueError("Invalid Google token")
            
            idinfo = response.json()

        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="No email provided by Google")

        # Find or create user
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                email=email,
                name=idinfo.get("name", "Unknown"),
                picture=idinfo.get("picture"),
                google_id=idinfo.get("sub")
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        # Generate JWT token
        access_token = create_access_token(subject=user.id)

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture
            }
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )
