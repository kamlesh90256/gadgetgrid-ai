from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.models.order_item import OrderItem
from app.models.order import Order
from app.models.cart import Cart

def get_order_details(
    db: Session,
    order_id: int,
    user_id: int,
):
    return (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
        )
        .filter(
            Order.id == order_id,
            Order.user_id == user_id,
        )
        .first()
    )

def get_orders(db: Session, user_id: int):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


from app.models.order_item import OrderItem

def place_order(
    db: Session,
    user_id: int,
):
    cart_items = (
        db.query(Cart)
        .filter(Cart.user_id == user_id)
        .all()
    )

    if not cart_items:
        return None

    total = sum(
        item.product.price * item.quantity
        for item in cart_items
    )

    order = Order(
        user_id=user_id,
        total=total,
    )

    db.add(order)
    db.flush()   # Generate order.id

    # Create Order Items
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price,
        )

        db.add(order_item)

    # Clear Cart
    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(order)

    return order