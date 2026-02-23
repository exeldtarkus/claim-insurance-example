from pydantic import BaseModel, Field
from uuid import UUID

class ClaimDraftUpdateRequest(BaseModel):
    insurance_id: UUID | None = None
    total_amount: float | None = Field(default=None, gt=0)
