from sqlalchemy.orm import Session

from core.response_helper import success_response
from ms_users.services.user_service import get_user_by_id


class UsersController:

    @staticmethod
    def findUserById(db: Session, currentUser):
        
        user_data = get_user_by_id(db, currentUser.get("userId"))
        res = {
            "email": user_data.get("email"),
            "fullName": "test",
            "isLocked": "N",
            "useDefaultPassword": False,
            "username": "test",
            "role": user_data.get("role")
        }

        return success_response(
            data=res,
            message="Login success",
        )