from pydantic import BaseModel


class CartCreate(BaseModel):
    product_id: int
    quantity: int = 1


class ProductInfo(BaseModel):
    id: int
    name: str
    description: str
    price: float

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    quantity: int
    product: ProductInfo

    class Config:
        from_attributes = True