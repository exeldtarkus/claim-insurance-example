from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from core.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    entity = Column(String)
    entity_id = Column(Integer)
    from_status = Column(String)
    to_status = Column(String)
    actor_role = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
