from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import db_connection
from core.middleware.validate_token import validate_token
from ms_users.controllers.users_controller import UsersController

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
def get_my_profile(
    db: Session = Depends(db_connection),
    current_user: dict = Depends(validate_token) 
):
    return UsersController.findUserById(db=db, currentUser=current_user)