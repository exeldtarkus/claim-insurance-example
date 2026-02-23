from sqlalchemy.orm import Session
from ms_activity_logs.models.activity_logs_model import ActivityLog


def log_activity(
    db: Session,
    entity: str,
    entity_id: int,
    from_status: str,
    to_status: str,
    actor_role: str,
):
    log = ActivityLog(
        entity=entity,
        entity_id=entity_id,
        from_status=from_status,
        to_status=to_status,
        actor_role=actor_role,
    )

    db.add(log)
