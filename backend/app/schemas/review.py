from pydantic import BaseModel


class ReviewCreate(BaseModel):
    rating: float
    comment: str
    product_id: int


class ReviewResponse(BaseModel):
    id: int
    rating: float
    comment: str

    class Config:
        from_attributes = True