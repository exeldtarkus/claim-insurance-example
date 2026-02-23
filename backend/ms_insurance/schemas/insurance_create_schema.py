from pydantic import BaseModel, Field
from uuid import UUID

class InsuranceCreateRequest(BaseModel):
    uuid: UUID
    amount: float = Field(gt=0)
    insurance_type: str
    desc: str | None = None
