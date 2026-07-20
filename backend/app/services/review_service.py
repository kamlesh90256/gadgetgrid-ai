from sqlalchemy.orm import Session

from app.models.review import Review


def add_review(
    db: Session,
    user_id: int,
    product_id: int,
    rating: float,
    comment: str,
):
    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        comment=comment,
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


def get_reviews(
    db: Session,
    product_id: int,
):
    return (
        db.query(Review)
        .filter(Review.product_id == product_id)
        .all()
    )