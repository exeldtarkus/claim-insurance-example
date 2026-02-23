from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ms_claims.models.claim_model import Claim
from ms_claims.enums.e_claim_status import ClaimStatus
from ms_claims.helpers.claim_transition import transition_claim


def create_claim(
        db: Session,
        user_id: int,
        insurance_id: str,
        total_amount: float
    ) -> Claim:
    """
    Create new claim in DRAFT state
    """
    claim = Claim(
        user_id=user_id,
        insurance_id=insurance_id,
        total_amount=total_amount,
        status=ClaimStatus.draft,
        version=1,
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)

    return claim


def submit_claim(db: Session, claim_id: int, actor_role: str) -> Claim:
    """
    DRAFT -> SUBMITTED
    """
    return transition_claim(
        db=db,
        claim_id=claim_id,
        from_status=ClaimStatus.draft,
        to_status=ClaimStatus.submitted,
        actor_role=actor_role,
    )


def review_claim(db: Session, claim_id: int, actor_role: str) -> Claim:
    """
    SUBMITTED -> REVIEWED
    """
    return transition_claim(
        db=db,
        claim_id=claim_id,
        from_status=ClaimStatus.submitted,
        to_status=ClaimStatus.reviewed,
        actor_role=actor_role,
    )


def approve_claim(db: Session, claim_id: int, actor_role: str) -> Claim:
    """
    REVIEWED -> APPROVED
    """
    return transition_claim(
        db=db,
        claim_id=claim_id,
        from_status=ClaimStatus.reviewed,
        to_status=ClaimStatus.approved,
        actor_role=actor_role,
    )


def reject_claim(db: Session, claim_id: int, actor_role: str) -> Claim:
    """
    REVIEWED -> REJECTED
    """
    return transition_claim(
        db=db,
        claim_id=claim_id,
        from_status=ClaimStatus.reviewed,
        to_status=ClaimStatus.rejected,
        actor_role=actor_role,
    )

def update_draft_claim(
    db: Session,
    claim_id: int,
    user_id: int,
    insurance_id: str | None,
    total_amount: float | None,
) -> Claim:
    claim = (
        db.query(Claim)
        .filter(
            Claim.id == claim_id,
            Claim.user_id == user_id,
        )
        .first()
    )

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found",
        )

    if claim.status != ClaimStatus.draft:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft claim can be updated",
        )

    if insurance_id is not None:
        claim.insurance_id = insurance_id

    if total_amount is not None:
        claim.total_amount = total_amount

    claim.version += 1

    db.commit()
    db.refresh(claim)
    return claim