from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.oauth2 import get_current_user
from app.models.user import User

from app.schemas.wishlist import (
    WishlistCreate,
    WishlistResponse,
)

from app.services.wishlist_service import (
    add_to_wishlist,
    get_wishlist,
    remove_from_wishlist,
)

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"],
)


@router.post("/", response_model=WishlistResponse)
def create_wishlist(
    item: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return add_to_wishlist(
        db=db,
        user_id=current_user.id,
        product_id=item.product_id,
    )


@router.get("/", response_model=list[WishlistResponse])
def read_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_wishlist(
        db=db,
        user_id=current_user.id,
    )


@router.delete("/{wishlist_id}")
def delete_wishlist(
    wishlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = remove_from_wishlist(
        db=db,
        wishlist_id=wishlist_id,
        user_id=current_user.id,
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found",
        )

    return {"message": "Removed from wishlist"}