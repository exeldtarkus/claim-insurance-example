from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from core.database import db_connection
from core.response_helper import success_response
from core.permission.guard import require_permissions
from core.permission.constants import ClaimPermissions

from ms_claims.schemas.claim_create_schema import ClaimCreateRequest
from ms_claims.schemas.claim_draft_schema import ClaimDraftUpdateRequest
from ms_claims.schemas.claim_pagination_schema import ClaimQueryParams
from ms_claims.controllers.claim_controller import ClaimController

router = APIRouter(
    prefix="/claims",
    tags=["Claims"],
)


# =====================
# List Claims
# =====================
@router.get("")
def list_claims(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: str | None = None,
    user_id: int | None = None,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_READ)
    ),
):
    params = ClaimQueryParams(
        page=page,
        limit=limit,
        status=status,
        user_id=user_id,
    )

    result = ClaimController.get_claims(db, user, params)

    return success_response(
        data=result,
        message="Claims fetched",
    )


# =====================
# Claim Detail
# =====================
@router.get("/{claim_id}")
def get_claim_detail(
    claim_id: int,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_READ)
    ),
):
    claim = ClaimController.get_claim_detail(db, claim_id, user)
    return success_response(claim, "Claim detail fetched")

# =====================
# Save Draft
# =====================
@router.put("/{claim_id}/draft")
def save_draft(
    claim_id: int,
    payload: ClaimDraftUpdateRequest,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_CREATE)
    ),
):
    result = ClaimController.save_draft(
        db=db,
        claim_id=claim_id,
        user=user,
        payload=payload,
    )

    return success_response(
        data=result,
        message="Draft updated",
    )

# =====================
# Create Claim
# =====================
@router.post("")
def create_claim(
    payload: ClaimCreateRequest,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_CREATE)
    ),
):
    result = ClaimController.create_claim(
        db=db,
        user=user,
        payload=payload
    )

    return success_response(
        data=jsonable_encoder(result), 
        message="Claim created",
        status_code=201,
    )


# =====================
# Submit Claim
# =====================
@router.post("/{claim_id}/submit")
def submit_claim(
    claim_id: int,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_SUBMIT)
    ),
):
    result = ClaimController.submit_claim(
        db=db,
        claim_id=claim_id,
        actor_role=user["role"],
    )

    return success_response(result, "Claim submitted")


# =====================
# Review Claim
# =====================
@router.post("/{claim_id}/review")
def review_claim(
    claim_id: int,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_REVIEW)
    ),
):
    result = ClaimController.review_claim(
        db=db,
        claim_id=claim_id,
        actor_role=user["role"],
    )

    return success_response(result, "Claim reviewed")


# =====================
# Approve Claim
# =====================
@router.post("/{claim_id}/approve")
def approve_claim(
    claim_id: int,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_APPROVE)
    ),
):
    result = ClaimController.approve_claim(
        db=db,
        claim_id=claim_id,
        actor_role=user["role"],
    )

    return success_response(result, "Claim approved")


# =====================
# Reject Claim
# =====================
@router.post("/{claim_id}/reject")
def reject_claim(
    claim_id: int,
    db: Session = Depends(db_connection),
    user=Depends(
        require_permissions(ClaimPermissions.CLAIM_REJECT)
    ),
):
    result = ClaimController.reject_claim(
        db=db,
        claim_id=claim_id,
        actor_role=user["role"],
    )

    return success_response(result, "Claim rejected")
