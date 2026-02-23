from operator import or_
from unittest import result

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ms_claims.enums.e_claim_status import ClaimStatus
from ms_claims.models.claim_model import Claim
from ms_insurance.models.insurance_model import Insurance
from ms_insurance.schemas.insurance_schema import InsuranceResponse

import logging

logger = logging.getLogger("insurance_service")

def create_insurance(db: Session, user_id: int, payload):
    insurance = Insurance(
        uuid=str(payload.uuid),
        user_id=user_id,
        amount=payload.amount,
        insurance_type=payload.insurance_type,
        desc=payload.desc,
    )

    db.add(insurance)
    db.commit()
    db.refresh(insurance)
    return insurance

def get_insurances(db: Session, user):
    logger.info(f"Retrieving filterable insurances for user ID: {user['id']}")

    # FIX: Ganti Insurance.id menjadi Insurance.uuid agar tipenya sama-sama String/UUID
    query = (
        db.query(Insurance)
        .outerjoin(Claim, Insurance.uuid == Claim.insurance_id) 
    )

    # Filter: Tampilkan yang belum diklaim, draft, atau rejected
    query = query.filter(
        or_(
            Claim.id == None,
            Claim.status.in_([ClaimStatus.draft, ClaimStatus.rejected])
        )
    )

    if user['role'] == 'user':
        query = query.filter(Insurance.user_id == user["id"])

    return query.distinct().all()


def get_insurance_detail(db: Session, insurance_id: int):
    insurance = db.get(Insurance, insurance_id)
    if not insurance:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Insurance not found")
    return insurance


def update_insurance(db: Session, insurance_id: int, payload):
    insurance = get_insurance_detail(db, insurance_id)

    if payload.amount is not None:
        insurance.amount = payload.amount
    if payload.insurance_type is not None:
        insurance.insurance_type = payload.insurance_type
    if payload.desc is not None:
        insurance.desc = payload.desc

    db.commit()
    db.refresh(insurance)
    return insurance


def delete_insurance(db: Session, insurance_id: int):
    insurance = get_insurance_detail(db, insurance_id)
    db.delete(insurance)
    db.commit()
