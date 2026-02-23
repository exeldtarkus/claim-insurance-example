import logging

from fastapi import Depends, HTTPException, status
from core.deps import get_current_user

logger = logging.getLogger("guard")

def require_permissions(*required_permissions: str):
    logger.info(f"Checking permissions: {required_permissions}")

    def dependency(user=Depends(get_current_user)):
        logger.info(f"Checking permissions for user {user.get('id')}: {required_permissions}")

        permissions = set(user.get("permissions", []))

        if not permissions.intersection(required_permissions):
            logger.warning(f"User {user.get('id')} does not have required permissions: {required_permissions}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied",
            )
        
        logger.info(f"User {user.get('id')} has required permissions: {required_permissions}")
        return user

    return dependency
