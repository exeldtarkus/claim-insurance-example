import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status

from ms_claims.models.claim_model import Claim
from ms_claims.enums.e_claim_status import ClaimStatus
from ms_activity_logs.services.activity_log_service import log_activity

# Inisialisasi Logger agar gampang debug di terminal
logger = logging.getLogger("ms_claims")
LOG_PREFIX = "[CLAIM_TRANSITION]"

def transition_claim(
    db: Session,
    claim_id: int,
    from_status: ClaimStatus,
    to_status: ClaimStatus,
    actor_role: str,
) -> Claim:
    """
    Melakukan transisi status klaim secara atomic.
    Menangani locking PostgreSQL, nested transactions, dan activity logging.
    """
    
    log_info = f"{LOG_PREFIX}[ID:{claim_id}] {from_status} -> {to_status} | Actor: {actor_role}"
    logger.info(f"{log_info} - START")

    try:
        # 1. Gunakan begin_nested() karena session biasanya sudah memiliki transaksi aktif
        # Ini bertindak sebagai 'Savepoint' di PostgreSQL
        with db.begin_nested():
            
            logger.debug(f"{log_info} - Locking record (FOR UPDATE OF claims)")
            claim = (
                db.query(Claim)
                .filter(Claim.id == claim_id, Claim.status == from_status)
                .with_for_update(of=Claim) 
                .first()
            )

            if not claim:
                logger.warning(f"{log_info} - FAILED: Claim not found or status changed by another process")
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Klaim tidak ditemukan atau status sudah berubah. Silakan refresh halaman."
                )

            # 3. Update State & Versioning
            claim.status = to_status
            claim.version += 1
            
            # Force update ke database sebelum logging
            db.flush() 

            # 4. Record ke Activity Log (Table log_activity)
            log_activity(
                db=db,
                entity="claim",
                entity_id=claim.id,
                from_status=from_status,
                to_status=to_status,
                actor_role=actor_role,
            )
            
            # Refresh data agar objek sinkron dengan state DB terbaru
            db.refresh(claim)
            
            logger.debug(f"{log_info} - Nested transaction success")

        # 5. Commit transaksi utama dan lepaskan objek dari session
        # Expunge penting agar tidak error 'User is not serializable' di router
        db.commit()
        db.expunge(claim) 

        logger.info(f"{log_info} - SUCCESS: Status updated to {to_status}")
        return claim

    except HTTPException:
        # Jangan log error di sini karena sudah ditangani di level router
        db.rollback()
        raise
        
    except Exception as e:
        db.rollback()
        # exc_info=True akan mencetak stack trace lengkap jika terjadi crash sistem
        logger.critical(f"{log_info} - CRASH: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan sistem saat update klaim: {str(e)}",
        )