from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta

from fastapi import HTTPException, status

from core.config import settings
from core.permission.role_matrix import ROLE_PERMISSION_MATRIX


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)

# =====================
# Password Hashing
# =====================
def hash_password(password: str) -> str:
    # PREVENT bcrypt 72 byte issue
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password too long")

    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    if len(password.encode("utf-8")) > 72:
        return False

    return pwd_context.verify(password, hashed)


# =====================
# JWT
# =====================
def create_access_token(user):
    """
    user MUST be ORM object
    - user.id
    - user.email
    - user.role
    """

    permissions = list(
        ROLE_PERMISSION_MATRIX.get(user.role, set())
    )

    payload = {
        "sub": user.email,
        "uid": user.id,
        "role": user.role,
        "permissions": permissions,
        "exp": datetime.utcnow()
        + timedelta(hours=settings.JWT_EXPIRE_HOURS),
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

def create_refresh_token(user):
    expire = datetime.utcnow() + timedelta(days=7)
    
    payload = {
        "sub": user.email,
        "type": "refresh",
        "exp": expire
    }
    
    return jwt.encode(
        payload, 
        settings.JWT_SECRET, 
        algorithm=settings.JWT_ALGORITHM
    )