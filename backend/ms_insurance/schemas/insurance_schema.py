from pydantic import BaseModel
from typing import Optional


class InsuranceResponse(BaseModel):
    id: int
    uuid: str
    user_id: int
    amount: float
    insurance_type: str
    desc: Optional[str]

    class Config:
        from_attributes = True