from pydantic import BaseModel, Field
from uuid import UUID

class ClaimCreateRequest(BaseModel):
    insurance_id: str
    total_amount: float = Field(gt=0)
