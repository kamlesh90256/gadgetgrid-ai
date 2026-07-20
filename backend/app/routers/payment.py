from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import razorpay

from app.database.database import get_db
from app.models.cart import Cart
from app.models.user import User
from app.auth.oauth2 import get_current_user

from app.core.config import (
    RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET,
)

from app.schemas.payment import PaymentVerify
from app.services.payment_service import verify_payment_signature

router = APIRouter(
    prefix="/payment",
    tags=["Payment"],
)

client = razorpay.Client(
    auth=(
        RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET,
    )
)


@router.post("/create-order")
def create_payment_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    cart_items = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty",
        )

    total = sum(
        item.product.price * item.quantity
        for item in cart_items
    )

    amount = int(total * 100)

    order = client.order.create(
        {
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,
        }
    )

    return order


@router.post("/verify")
def verify_payment(
    data: PaymentVerify,
    current_user: User = Depends(get_current_user),
):

    verified = verify_payment_signature(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature,
    )

    if not verified:
        raise HTTPException(
            status_code=400,
            detail="Payment verification failed",
        )

    return {
        "success": True,
        "message": "Payment verified successfully",
    }