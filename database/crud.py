from sqlalchemy.orm import Session
from models.user_model import User


# -------------------------------
# Create New User
# -------------------------------

def create_user(db: Session, username: str, email: str, hashed_password: str):

    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# -------------------------------
# Get User by Email
# -------------------------------

def get_user_by_email(db: Session, email: str):

    return db.query(User).filter(User.email == email).first()


# -------------------------------
# Get User by Username
# -------------------------------

def get_user_by_username(db: Session, username: str):

    return db.query(User).filter(User.username == username).first()


# -------------------------------
# Get User by ID
# -------------------------------

def get_user_by_id(db: Session, user_id: int):

    return db.query(User).filter(User.id == user_id).first()