from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials 
from sqlalchemy.orm import Session

from core.database import db_connection
from ms_auth.schemas.login_request import LoginRequest
from ms_auth.controllers.auth_controller import AuthController
from ms_auth.schemas.refresh_token_request import RefreshRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

security_scheme = HTTPBearer()

@router.post("/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(db_connection),
):
    return AuthController.login(db, payload)

@router.post("/refresh")
def refresh(
    payload: RefreshRequest,
    db: Session = Depends(db_connection)
):
    return AuthController.refresh(db, payload)

@router.get("/verify")
def verify(
    auth: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(db_connection),
):
    return AuthController.verify(db, auth.credentials)