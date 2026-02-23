from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ms_auth.models.user_auth_model import UserAuth
from core.security import create_refresh_token, decode_token, verify_password, create_access_token


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(UserAuth)
        .filter(UserAuth.email == email)
        .first()
    )

    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    return {
        "token": token,
        "refreshToken": refresh_token,
        "role": user.role,
        "email": user.email,
    }

def refresh_access_token(db: Session, refresh_token: str):
    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
        
    user = db.query(UserAuth).filter(UserAuth.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token(user)
    
    return {
        "token": new_access_token,
        "role": user.role
    }

def verify_jwt_token(
    db: Session,
    token: str,
):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(UserAuth).filter(UserAuth.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return True

