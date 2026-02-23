from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import db_connection
from core.permission.guard import require_permissions
from core.permission.constants import InsurancePermissions
from core.response_helper import success_response

from ms_insurance.schemas.insurance_create_schema import InsuranceCreateRequest
from ms_insurance.schemas.insurance_schema import InsuranceResponse
from ms_insurance.schemas.insurance_update_schema import InsuranceUpdateRequest
from ms_insurance.services import insurance_service

router = APIRouter(
    prefix="/insurance",
    tags=["Insurance"],
)

@router.get("")
def list_insurance(
    db: Session = Depends(db_connection),
    user=Depends(require_permissions(InsurancePermissions.INSURANCE_READ)),
):
    result = insurance_service.get_insurances(db, user=user)

    return success_response(
        data=result,
        message="Insurance list",
    )


@router.get("/{insurance_id}")
def get_insurance(
    insurance_id: int,
    db: Session = Depends(db_connection),
    user=Depends(require_permissions(InsurancePermissions.INSURANCE_READ)),
):
    return success_response(
        insurance_service.get_insurance_detail(db, insurance_id),
        "Insurance detail fetched",
    )


@router.post("")
def create_insurance(
    payload: InsuranceCreateRequest,
    db: Session = Depends(db_connection),
    user=Depends(require_permissions(InsurancePermissions.INSURANCE_CREATE)),
):
    return success_response(
        insurance_service.create_insurance(db, user["id"], payload),
        "Insurance created",
        status_code=201,
    )


@router.put("/{insurance_id}")
def update_insurance(
    insurance_id: int,
    payload: InsuranceUpdateRequest,
    db: Session = Depends(db_connection),
    user=Depends(require_permissions(InsurancePermissions.INSURANCE_UPDATE)),
):
    return success_response(
        insurance_service.update_insurance(db, insurance_id, payload),
        "Insurance updated",
    )


@router.delete("/{insurance_id}")
def delete_insurance(
    insurance_id: int,
    db: Session = Depends(db_connection),
    user=Depends(require_permissions(InsurancePermissions.INSURANCE_DELETE)),
):
    insurance_service.delete_insurance(db, insurance_id)
    return success_response(None, "Insurance deleted")
