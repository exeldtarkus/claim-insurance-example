from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ms_auth.services.auth_service import authenticate_user, verify_jwt_token, refresh_access_token
from core.response_helper import success_response


class AuthController:

    @staticmethod
    def login(db: Session, payload):
        if not payload.email or not payload.email.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required",
            )

        if not payload.password or not payload.password.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required",
            )

        result = authenticate_user(
            db=db,
            email=payload.email.strip(),
            password=payload.password,
        )

        return success_response(
            data=result,
            message="Login success",
        )

    @staticmethod
    def refresh(db: Session, payload):
        if not payload.refreshToken:
            raise HTTPException(status_code=400, detail="Refresh token required")
            
        result = refresh_access_token(db, payload.refreshToken)
        return success_response(data=result, message="Token refreshed")

    @staticmethod
    def verify(db: Session, token: str):
        """
        Controller untuk memverifikasi validitas token JWT.
        """
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing",
            )

        user_data = verify_jwt_token(db=db, token=token)

        return success_response(
            data=user_data,
            message="Token is valid",
        )