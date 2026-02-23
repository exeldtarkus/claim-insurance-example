from pydantic import BaseModel

class RefreshRequest(BaseModel):
    refreshToken: str
