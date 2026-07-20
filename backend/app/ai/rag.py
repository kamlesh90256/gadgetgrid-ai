from app.database.database import SessionLocal
from app.models.product import Product

from app.ai.embedding import get_embedding
from app.ai.chroma_db import collection




def index_products():
    try:
        ids = collection.get()["ids"]
        if ids:
            collection.delete(ids=ids)
    except Exception:
        pass

    db = SessionLocal()
    products = db.query(Product).all()

    for product in products:
        text = f"""
Name: {product.name}
Category: {product.category}
Description: {product.description}
"""

        embedding = get_embedding(text)

        collection.add(
            ids=[str(product.id)],
            embeddings=[embedding],
            documents=[text],
            metadatas=[
                {
                    "name": product.name,
                    "category": product.category,
                    "price": product.price,
                }
            ],
        )

    db.close()

    print(f"{len(products)} products indexed successfully!")

def search_products(query: str):
    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3,
    )

    return results   

from app.ai.llm import ask_llm


def rag_search(query: str):
    results = search_products(query)

    docs = results["documents"][0]

    context = "\n\n".join(docs)

    return ask_llm(query, context) 

