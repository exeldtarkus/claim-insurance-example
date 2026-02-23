from sqlalchemy.orm import Session
from ms_auth.models.user_auth_model import UserAuth
from fastapi import HTTPException

def get_user_by_id(db: Session, user_id: int):
    user = db.query(UserAuth).filter(UserAuth.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }