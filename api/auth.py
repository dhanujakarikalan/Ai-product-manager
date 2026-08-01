from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.crud import (
    create_user,
    get_user_by_email,
    get_user_by_username
)

from authentication.password import (
    hash_password,
    verify_password
)

from authentication.jwt_handler import create_access_token

from schemas.auth import (
    RegisterRequest,
    LoginRequest,
    Token,
    UserResponse
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_email = get_user_by_email(db, request.email)

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    existing_username = get_user_by_username(
        db,
        request.username
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    hashed_password = hash_password(request.password)

    user = create_user(
        db=db,
        username=request.username,
        email=request.email,
        hashed_password=hashed_password
    )

    return user


@router.post("/login", response_model=Token)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = get_user_by_email(
        db,
        request.email
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(
        request.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
            "id": user.id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }