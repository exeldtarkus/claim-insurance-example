from sqlalchemy import Column, Integer, String
from core.database import Base

class UserAuth(Base):
    __tablename__ = "user_auth"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
