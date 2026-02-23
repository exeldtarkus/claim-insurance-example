from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ms_claims.services import claim_service
from ms_claims.services.claim_query_service import (
    get_claims,
    get_claim_detail,
)


class ClaimController:

    @staticmethod
    def create_claim(
        db: Session,
        user,
        payload
    ):
        return claim_service.create_claim(
            db=db,
            user_id=user["id"],
            insurance_id=str(payload.insurance_id),
            total_amount=payload.total_amount,
        )

    @staticmethod
    def save_draft(
        db: Session,
        claim_id: int,
        user,
        payload,
    ):
        return claim_service.update_draft_claim(
            db=db,
            claim_id=claim_id,
            user_id=user["id"],
            insurance_id=(
                str(payload.insurance_id)
                if payload.insurance_id
                else None
            ),
            total_amount=payload.total_amount,
        )

    @staticmethod
    def submit_claim(db: Session, claim_id: int, actor_role: str):
        return claim_service.submit_claim(
            db=db,
            claim_id=claim_id,
            actor_role=actor_role,
        )

    @staticmethod
    def review_claim(db: Session, claim_id: int, actor_role: str):
        return claim_service.review_claim(
            db=db,
            claim_id=claim_id,
            actor_role=actor_role,
        )

    @staticmethod
    def approve_claim(db: Session, claim_id: int, actor_role: str):
        return claim_service.approve_claim(
            db=db,
            claim_id=claim_id,
            actor_role=actor_role,
        )

    @staticmethod
    def reject_claim(db: Session, claim_id: int, actor_role: str):
        return claim_service.reject_claim(
            db=db,
            claim_id=claim_id,
            actor_role=actor_role,
        )

    @staticmethod
    def get_claims(db: Session, user, params):
        return get_claims(db, user, params)

    @staticmethod
    def get_claim_detail(db: Session, claim_id: int, user):
        claim = get_claim_detail(db, claim_id, user)
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found",
            )
        return claim
