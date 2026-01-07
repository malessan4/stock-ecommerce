from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError 
from app.database import get_session
from app.models import Product

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=Product)
def create_product(product: Product, session: Session = Depends(get_session)):
    try:
        session.add(product)
        session.commit()
        session.refresh(product)
        return product
    except IntegrityError:
        session.rollback() # Cancelamos la transacción para no dejar la DB trabada
        # Devolvemos un error 400 (Bad Request) que el frontend entenderá
        raise HTTPException(status_code=400, detail="El SKU ya existe, intenta con otro.")

@router.get("/", response_model=list[Product])
def read_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products