from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.order import Order

from app.database.database import get_db
from app.auth.oauth2 import get_current_user, get_current_admin
from app.models.user import User
from app.schemas.order import OrderResponse
from app.services.order_service import place_order
from app.services.order_service import (
    place_order,
    get_orders,
    get_order_details,
)
from app.schemas.order import (
    OrderResponse,
    OrderDetailsResponse,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

@router.get("/{order_id}", response_model=OrderDetailsResponse)
def read_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = get_order_details(
        db=db,
        order_id=order_id,
        user_id=current_user.id,
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    return order

@router.post("/", response_model=OrderResponse)
def create_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = place_order(
        db=db,
        user_id=current_user.id,
    )

    if order is None:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty",
        )

    return order
@router.get("/", response_model=list[OrderResponse])
def read_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_orders(
        db=db,
        user_id=current_user.id,
    )

