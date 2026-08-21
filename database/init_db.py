from database.database import engine, Base
from models.feedback_db import Feedback

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")