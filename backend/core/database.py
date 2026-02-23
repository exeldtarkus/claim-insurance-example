import logging
from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status

from core.config import settings

logger = logging.getLogger("database")

# =========================
# Engine Factory
# =========================
def create_db_engine():
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
        )

        # 🔍 Test connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        logger.info("Connected to database successfully")
        return engine

    except SQLAlchemyError as e:
        logger.error("not connected to database")
        logger.debug(f"Database error detail: {e}")
        return None


engine = create_db_engine()

SessionLocal = (
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    if engine
    else None
)

Base = declarative_base()

from core.model_registry import *

# =========================
# Dependency
# =========================
def db_connection() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is not available",
        )

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
