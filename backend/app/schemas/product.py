from typing import Optional
from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str
    image_url: Optional[str] = None


class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True