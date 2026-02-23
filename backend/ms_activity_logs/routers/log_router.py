from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import SessionLocal
from core.security import verify_password, create_token
from ms_auth.models.user_auth_model import UserAuth
from core.database import db_connection

router = APIRouter(prefix="/auth")


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(db_connection)):
    user = db.query(UserAuth).filter_by(email=email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({"sub": user.email, "role": user.role})
    return {"access_token": token}
