from sqlalchemy import Column, Integer, String
from database.database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    customer = Column(String(100), nullable=False)
    feedback = Column(String, nullable=False)