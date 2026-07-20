from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import SECRET_KEY, ALGORITHM
from app.database.database import get_db
from app.models.user import User
from fastapi import Depends, HTTPException, status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        print("TOKEN =", token)
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if user is None:
            raise credentials_exception

        return user    

    except JWTError as e:
           print("JWT ERROR =", e)
           raise credentials_exception
    
def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    print("ROLE =", current_user.role)

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return current_user

    