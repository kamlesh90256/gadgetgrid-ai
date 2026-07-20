from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.oauth2 import get_current_user
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewResponse,
)
from app.services.review_service import (
    add_review,
    get_reviews,
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)


@router.post("/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return add_review(
        db=db,
        user_id=current_user.id,
        product_id=review.product_id,
        rating=review.rating,
        comment=review.comment,
    )


@router.get("/{product_id}", response_model=list[ReviewResponse])
def read_reviews(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_reviews(
        db=db,
        product_id=product_id,
    )