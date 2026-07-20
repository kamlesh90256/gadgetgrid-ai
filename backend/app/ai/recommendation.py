from sqlalchemy.orm import Session
from app.models.product import Product

def get_recommended_products(db: Session, product: Product):
    return (
        db.query(Product)
        .filter(
            Product.category == product.category,
            Product.id != product.id,
        )
        .limit(4)
        .all()
    )