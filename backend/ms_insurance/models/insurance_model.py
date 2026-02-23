from sqlalchemy import Column, Integer, String, Float, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base


class Insurance(Base):
    __tablename__ = "insurance"

    id = Column(Integer, primary_key=True)
    uuid = Column(String, nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    insurance_type = Column(
        Enum(
            "kesehatan",
            "jiwa",
            "pendidikan",
            "kendaraan",
            "properti",
            name="insurance_type_enum",
        ),
        nullable=False,
    )
    desc = Column(Text, nullable=True)

    user = relationship("User")
