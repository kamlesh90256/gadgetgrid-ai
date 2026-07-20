from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import os
from google import genai
from dotenv import load_dotenv
from app.models.product import Product
from app.auth.oauth2 import get_current_admin
from app.models.user import User
from app.ai.recommendation import get_recommended_products
from app.database.database import get_db
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import (
    create_product,
    get_all_products,
    get_product_by_id,
    update_product,
    delete_product,
    search_products,
)
from app.ai.rag import rag_search

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return get_all_products(db)


# 👇 Ask endpoint MUST come before /{product_id}
@router.get("/ask")
def ask(question: str):
    return {
        "answer": rag_search(question)
    }


@router.get("/search")
def search(
    keyword: str = Query(...),
    db: Session = Depends(get_db),
):
    return search_products(db, keyword)


from app.models.product import Product

@router.get("/compare")
def compare_products(
    product1: str,
    product2: str,
    db: Session = Depends(get_db),
):
    try:
        p1 = db.query(Product).filter(Product.name == product1).first()
        p2 = db.query(Product).filter(Product.name == product2).first()

        if p1 is None or p2 is None:
            raise HTTPException(status_code=404, detail="Product not found")

        prompt = f"""
You are an expert e-commerce assistant.

Compare these two products professionally.

Product 1:
Name: {p1.name}
Category: {p1.category}
Price: ₹{p1.price}
Description: {p1.description}

Product 2:
Name: {p2.name}
Category: {p2.category}
Price: ₹{p2.price}
Description: {p2.description}

Rules:
- Use Markdown.
- Keep the answer under 250 words.

Return in this format:

# Product Comparison

| Feature | {p1.name} | {p2.name} |
|---------|-----------|-----------|
| Performance | | |
| Display | | |
| Battery | | |
| Camera | | |
| Price | | |
| Best For | | |

## Winner

Mention the better product and explain why.
"""

        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
        )

        return {
            "comparison": response.text
        }

    except Exception as e:
        print("Gemini Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product    


@router.post("/")
def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_admin),
):
    return create_product(db, product)


@router.put("/{product_id}")
def edit_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    updated = update_product(db, product_id, product)

    if updated is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return updated


@router.delete("/{product_id}")
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    product = delete_product(db, product_id)

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"message": "Product deleted successfully"}

@router.get("/{product_id}/recommendations")
def recommendations(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return get_recommended_products(db, product)