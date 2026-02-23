from fastapi import FastAPI, APIRouter, HTTPException
from core.exception_handler import (
    http_exception_handler,
    unhandled_exception_handler
)

from core.logging_config import setup_logging
from ms_auth.routers.auth_router import router as auth_router
from ms_claims.routers.claim_router import router as claim_router
from ms_insurance.routers.insurance_router import router as insurance_router
from ms_users.routers.user_router import router as user_router

setup_logging()

app = FastAPI(
    title="Claim Approval System",
    description="""
Approval System untuk proses klaim asuransi.

### Lifecycle Klaim
- `draft` → `submitted` → `reviewed` → `approved / rejected`

### Role
- **user**: submit klaim
- **verifier**: review klaim
- **approver**: approve / reject klaim
""",
    version="1.0.0",
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


# === Routers ===
api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router, tags=["Auth"])
api_router.include_router(claim_router, tags=["Claims"])
api_router.include_router(insurance_router, tags=["Insurance"])
api_router.include_router(user_router, tags=["Users"])


app.include_router(api_router)

@app.get(
    "/",
    tags=["System"],
    summary="Root endpoint",
    description="Root endpoint aplikasi"
)
def root():
    return {"message": "welcome to Claim Approval System!"}


@app.get(
    "/health",
    tags=["System"],
    summary="Health check",
    description="Endpoint untuk memastikan service berjalan normal"
)
def health():
    return {"status": "ok"}
