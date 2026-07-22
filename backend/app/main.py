from fastapi import FastAPI
from app.routers.products import router as product_router
from app.routers.cart import router as cart_router
from app.database.database import engine
from app.database.base import Base
from app.models.product import Product
from app.models.user import User
from app.models.cart import Cart
from app.routers.users import router as user_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.order import Order
from app.models.order_item import OrderItem
from app.routers import order
from app.routers import review
from app.routers import wishlist
from app.routers import payment
from app.routers.admin import router as admin_router
from fastapi.staticfiles import StaticFiles
from app.routers.upload import router as upload_router
app = FastAPI(
    title="GADGETGRID AI",
    description="AI Powered E-commerce Product Intelligence Platform",
    version="1.0.0",
)

app.mount("/images", StaticFiles(directory="images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://gadgetgrid-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "Welcome to GADGETGRID AI 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(product_router)
app.include_router(user_router)
app.include_router(cart_router)
app.include_router(order.router)
app.include_router(review.router)
app.include_router(wishlist.router)
app.include_router(payment.router)
app.include_router(admin_router)
app.include_router(upload_router)