from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.cart import CartCreate, CartResponse
from app.services.cart_service import (
    add_to_cart,
    get_cart,
    remove_cart_item,
    update_quantity,
)
from app.auth.oauth2 import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/cart",
    tags=["Cart"],
)


@router.post("/")
def create_cart_item(
    item: CartCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return add_to_cart(
        db=db,
        user_id=current_user.id,
        product_id=item.product_id,
        quantity=item.quantity,
    )


@router.get("/", response_model=list[CartResponse])
def read_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_cart(
        db=db,
        user_id=current_user.id,
    )


@router.delete("/{cart_id}")
def delete_cart_item(
    cart_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return remove_cart_item(
        db=db,
        cart_id=cart_id,
        user_id=current_user.id,
    )


@router.put("/{cart_id}")
def change_quantity(
    cart_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_quantity(
        db=db,
        cart_id=cart_id,
        user_id=current_user.id,
        quantity=quantity,
    )