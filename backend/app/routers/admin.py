from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.auth.oauth2 import get_current_admin

from app.models.product import Product
from app.models.order import Order
from app.models.user import User
from sqlalchemy import func
from datetime import datetime
from sqlalchemy import func
from app.models.order_item import OrderItem

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    products = db.query(Product).count()

    orders = db.query(Order).count()

    users = db.query(User).count()

    revenue = (
    db.query(func.sum(Order.total))
    .scalar()
    or 0
)

    return {
        "products": products,
        "orders": orders,
        "users": users,
        "revenue": revenue,
    }

@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return db.query(Order).all()


@router.put("/orders/{order_id}")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    order.status = status

    db.commit()
    db.refresh(order)

    return order

@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return db.query(User).all()


@router.put("/users/{user_id}")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user.role = role

    db.commit()
    db.refresh(user)

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # 👇 Ye yahan add karo
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }

@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    monthly_revenue = (
        db.query(
            func.extract("month", Order.created_at).label("month"),
            func.sum(Order.total).label("revenue"),
        )
        .group_by(func.extract("month", Order.created_at))
        .order_by(func.extract("month", Order.created_at))
        .all()
    )

    month_names = [
        "",
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    revenue_chart = [
        {
            "month": month_names[int(row.month)],
            "revenue": row.revenue,
        }
        for row in monthly_revenue
    ]

    return {
        "monthly_revenue": revenue_chart,
    }

@router.get("/recent-orders")
def recent_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return [
    {
        "id": order.id,
        "user": order.user.fullname,
        "total": order.total,
        "status": order.status,
        "created_at": order.created_at,
    }
    for order in orders
]

@router.get("/order-status")
def order_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    data = (
        db.query(
            Order.status,
            func.count(Order.id).label("count"),
        )
        .group_by(Order.status)
        .all()
    )

    return [
        {
            "status": row.status,
            "count": row.count,
        }
        for row in data
    ]

@router.get("/top-products")
def top_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    data = (
        db.query(
            Product.name,
            func.sum(OrderItem.quantity).label("sold"),
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    return [
        {
            "product": row.name,
            "sold": row.sold,
        }
        for row in data
    ]