from typing import Optional
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    message: str
    statusCode: int
    trace: Optional[str] = None
