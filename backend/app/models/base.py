import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import DateTime
from app.core.database import Base

class BaseModel(Base):
    __abstract__ = True

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
