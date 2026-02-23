from sqlalchemy import desc
from sqlalchemy.orm import Session
from ms_claims.models.claim_model import Claim
from ms_claims.enums.e_claim_status import ClaimStatus

from ms_claims.schemas.claim_pagination_schema import ClaimQueryParams

def get_claims(db: Session, user: dict, params: ClaimQueryParams):
    query = db.query(Claim)

    # Ambil role dan ID dari dictionary user
    user_role = user.get("role", "").lower()
    user_id_from_token = user.get("id")

    # =====================
    # Role-based scope (RBAC)
    # =====================
    # 1. User biasa: Hanya bisa melihat klaim miliknya sendiri
    if user_role == "user":
        query = query.filter(Claim.user_id == user_id_from_token)

    # 2. Verifier: Melihat klaim yang statusnya 'submitted'
    elif user_role == "verifier":
        query = query.filter(Claim.status == ClaimStatus.submitted)

    # 3. Approver: Melihat klaim yang statusnya 'reviewed'
    elif user_role == "approver":
        query = query.filter(Claim.status == ClaimStatus.reviewed)

    # =====================
    # Claim-specific filters
    # =====================
    # Filter tambahan berdasarkan parameter query status
    if params.status:
        query = query.filter(Claim.status == params.status)

    # Filter berdasarkan user_id (hanya untuk role selain 'user')
    if params.user_id and user_role != "user":
        query = query.filter(Claim.user_id == params.user_id)

    total = query.count()

    # Eksekusi pagination
    items = (
        query
        .order_by(desc(Claim.id))
        .offset(params.offset)
        .limit(params.limit)
        .all()
    )

    return {
        "items": items,
        "meta": {
            "page": params.page,
            "limit": params.limit,
            "total": total,
            "totalPages": (total + params.limit - 1) // params.limit,
        },
    }
def get_claim_detail(db: Session, claim_id: int, user: dict):
    """
    Get claim detail with ownership & role validation
    """
    claim = db.get(Claim, claim_id)

    if not claim:
        return None

    # Ambil role dan id dari dictionary user secara aman
    user_role = user.get("role")
    user_id = user.get("id")

    # user hanya boleh lihat klaim sendiri
    if user_role == "user" and claim.user_id != user_id:
        return None

    # verifier hanya boleh lihat submitted
    if user_role == "verifier" and claim.status != ClaimStatus.submitted:
        return None

    # approver hanya boleh lihat reviewed
    if user_role == "approver" and claim.status != ClaimStatus.reviewed:
        return None

    return claim