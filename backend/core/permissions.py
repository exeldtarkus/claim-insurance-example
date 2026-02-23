from fastapi import Depends, HTTPException, status
from typing import List

from core.deps import get_current_user


def require_roles(*allowed_roles: List[str]):
    """
    Dependency untuk validasi role user
    Usage:
        Depends(require_roles("user"))
        Depends(require_roles("verifier", "approver"))
    """

    def _role_checker(user = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return user

    return _role_checker
