from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Generator
from sqlalchemy.orm import Session

from core.database import db_connection, SessionLocal
from core.security import decode_token
from ms_users.models.user_model import User
import logging

logger = logging.getLogger("deps")

# =========================
# OAuth2 Scheme
# =========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# =========================
# Get Current User
# =========================
def get_current_user(
    db: Session = Depends(db_connection),
    token: str = Depends(oauth2_scheme),
):
    logger.info(f"get_current_user - Attempting to get current user with token: {token}")
    payload = decode_token(token)
    if not payload:
        logger.error(f"get_current_user - Invalid token: {token}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    logger.debug(f"get_current_user - Found user: {user}")

    if not user:
        logger.error(f"get_current_user - User not found for email: {payload['sub']}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return {
        "id": user.id,
        "email": payload["sub"],
        "role": payload["role"],
        "permissions": payload.get("permissions", []),
    }


# =========================
# Role Guard
# =========================
def require_role(*roles: str):
    def checker(user=Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden",
            )
        return user

    return checker


# =========================
# Optional DB Dependency
# (tetap dipertahankan)
# =========================
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
