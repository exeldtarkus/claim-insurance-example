from pydantic import BaseModel
from ms_claims.enums.e_claim_status import ClaimStatus

class ClaimResponse(BaseModel):
    id: int
    status: ClaimStatus
    version: int

    class Config:
        from_attributes = True
