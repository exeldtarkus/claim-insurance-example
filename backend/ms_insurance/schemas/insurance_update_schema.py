from pydantic import BaseModel, Field

class InsuranceUpdateRequest(BaseModel):
    amount: float | None = Field(default=None, gt=0)
    insurance_type: str | None = None
    desc: str | None = None
