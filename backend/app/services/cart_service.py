from sqlalchemy.orm import Session, joinedload

from app.models.cart import Cart


def add_to_cart(
    db: Session,
    user_id: int,
    product_id: int,
    quantity: int,
):
    existing = (
        db.query(Cart)
        .filter(
            Cart.user_id == user_id,
            Cart.product_id == product_id,
        )
        .first()
    )

    if existing:
        existing.quantity += quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = Cart(
        user_id=user_id,
        product_id=product_id,
        quantity=quantity,
    )

    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    return cart_item


def get_cart(
    db: Session,
    user_id: int,
):
    return (
        db.query(Cart)
        .options(joinedload(Cart.product))
        .filter(Cart.user_id == user_id)
        .all()
    )


def remove_cart_item(
    db: Session,
    cart_id: int,
    user_id: int,
):
    item = (
        db.query(Cart)
        .filter(
            Cart.id == cart_id,
            Cart.user_id == user_id,
        )
        .first()
    )

    if item:
        db.delete(item)
        db.commit()

    return {"message": "Item removed successfully"}


def update_quantity(
    db: Session,
    cart_id: int,
    user_id: int,
    quantity: int,
):
    item = (
        db.query(Cart)
        .filter(
            Cart.id == cart_id,
            Cart.user_id == user_id,
        )
        .first()
    )

    if item:
        item.quantity = quantity
        db.commit()
        db.refresh(item)

    return item