from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base
from sqlalchemy import String

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    total = Column(
        Float,
        nullable=False,
    )

    status = Column(
    String,
    default="Pending",
    nullable=False,
    )
    


    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    user = relationship("User")

    items = relationship(
    "OrderItem",
    back_populates="order",
    cascade="all, delete-orphan",
)