from pydantic import BaseModel
from typing import Optional


class ClaimResponse(BaseModel):
    id: int
    user_id: int
    status: str
    version: int

    class Config:
        from_attributes = True  # Pydantic v2
