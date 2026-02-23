from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from core.security import decode_token

security = HTTPBearer()

async def validate_token(auth: HTTPAuthorizationCredentials = Depends(security)):
    """
    Fungsi ini bertindak sebagai 'Guard'. 
    Ia mengambil token, men-decode, dan mengembalikan payload user.
    """
    token = auth.credentials
    payload = decode_token(token) # return 401 if expired/invalid
    
    user_id: int = payload.get("uid")
    email: str = payload.get("sub")
    role: str = payload.get("role")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid: User ID tidak ditemukan",
        )
    
    return {
        "userId": user_id,
        "email": email,
        "role": role,
        "permissions": payload.get("permissions")
    }