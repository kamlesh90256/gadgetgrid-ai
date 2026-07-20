from sqlalchemy.orm import Session, joinedload

from app.models.wishlist import Wishlist


def add_to_wishlist(
    db: Session,
    user_id: int,
    product_id: int,
):
    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id,
            Wishlist.product_id == product_id,
        )
        .first()
    )

    if existing:
        return existing

    item = Wishlist(
        user_id=user_id,
        product_id=product_id,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_wishlist(
    db: Session,
    user_id: int,
):
    return (
        db.query(Wishlist)
        .options(joinedload(Wishlist.product))
        .filter(Wishlist.user_id == user_id)
        .all()
    )


def remove_from_wishlist(
    db: Session,
    wishlist_id: int,
    user_id: int,
):
    item = (
        db.query(Wishlist)
        .filter(
            Wishlist.id == wishlist_id,
            Wishlist.user_id == user_id,
        )
        .first()
    )

    if item:
        db.delete(item)
        db.commit()

    return item
