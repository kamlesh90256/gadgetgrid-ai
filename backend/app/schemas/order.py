from datetime import datetime
from pydantic import BaseModel

from app.schemas.product import ProductResponse


class OrderItemResponse(BaseModel):
    quantity: int
    price: float
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    total: float
    created_at: datetime

    class Config:
        from_attributes = True


class OrderDetailsResponse(BaseModel):
    id: int
    total: float
    created_at: datetime
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True