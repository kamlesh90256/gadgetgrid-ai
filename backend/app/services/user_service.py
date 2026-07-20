from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.auth.hash import get_password_hash
from app.auth.hash import verify_password
from app.auth.jwt_handler import create_access_token


def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)

    db_user = User(
    fullname=user.fullname,
    email=user.email,
    password=hashed_password,
    role="user",
)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user