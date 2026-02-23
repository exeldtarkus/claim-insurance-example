from sqlalchemy import Column, Float, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    insurance_id = Column(String, nullable=True)
    total_amount = Column(Float,nullable=True)
    status = Column(String, nullable=False)
    version = Column(Integer, nullable=False, default=1)

    user = relationship(
        "User",
        back_populates="claims",
        lazy="joined",
    )
