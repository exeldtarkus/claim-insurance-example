from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)

    claims = relationship(
        "Claim",
        back_populates="user",
        cascade="all, delete-orphan"
    )
