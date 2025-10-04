from sqlalchemy import Column, Integer, String
from api.db import Base
from pydantic import BaseModel

# SQLAlchemy Model (Database)
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    age = Column(Integer, nullable=False)


# Pydantic Schema (Response)
class User(BaseModel):
    id: int
    username: str
    name: str
    email: str
    age: int

    class Config:
        orm_mode = True
