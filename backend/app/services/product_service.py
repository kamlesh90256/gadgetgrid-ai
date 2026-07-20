import os
from pathlib import Path

from sqlalchemy.orm import Session
from google import genai
from dotenv import load_dotenv

from app.models.product import Product
from app.schemas.product import ProductCreate

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

print("Gemini Key:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def create_product(db: Session, product: ProductCreate):
    print("Received:", product.model_dump())

    db_product = Product(
        name=product.name,
        category=product.category,
        price=product.price,
        description=product.description,
        image_url=product.image_url,
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    print("Saved:", db_product.image_url)

    return db_product

def search_products(db: Session, keyword: str):
    return (
        db.query(Product)
        .filter(Product.name.ilike(f"%{keyword}%"))
        .all()
    )


def get_all_products(db: Session):
    return db.query(Product).all()


def get_product_by_id(db: Session, product_id: int):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        return None

    summary = generate_ai_summary(product)

    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "price": product.price,
        "description": product.description,
        "image_url": product.image_url,
        "summary": summary,
    }

def delete_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        return None

    # Delete image file from backend/images
    if product.image_url:
        filename = product.image_url.split("/")[-1]
        image_path = os.path.join("images", filename)

        if os.path.exists(image_path):
            os.remove(image_path)

    db.delete(product)
    db.commit()

    return product

def update_product(db: Session, product_id: int, product: ProductCreate):

    db_product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if db_product is None:
        return None

    db_product.name = product.name
    db_product.category = product.category
    db_product.price = product.price
    db_product.description = product.description
    db_product.image_url = product.image_url

    db.commit()
    db.refresh(db_product)

    return db_product

def generate_ai_summary(product):
    prompt = f"""
You are an expert e-commerce assistant.

Product Name:
{product.name}

Category:
{product.category}

Description:
{product.description}

Generate a professional product summary.

Requirements:
- Around 80 words
- Mention key features.
- Mention who should buy this product.
- Mention benefits.
- Do NOT copy the description.
- Write in natural marketing language.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        print("Gemini Error:", e)
        return product.description