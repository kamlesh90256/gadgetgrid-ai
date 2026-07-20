from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String(1000), nullable=True)

    image_url = Column(String, nullable=True)

    reviews = relationship(
        "Review",
        back_populates="product",
        cascade="all, delete-orphan",
    )