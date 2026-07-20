from pydantic import BaseModel


class ProductWishlist(BaseModel):
    id: int
    name: str
    category: str
    price: float
    description: str

    class Config:
        from_attributes = True


class WishlistCreate(BaseModel):
    product_id: int


class WishlistResponse(BaseModel):
    id: int
    product: ProductWishlist

    class Config:
        from_attributes = True