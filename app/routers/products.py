from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Product

# Creamos el router (es como una mini-app de FastAPI)
router = APIRouter(prefix="/products", tags=["products"])

# 1. Endpoint para CREAR un producto (POST)
@router.post("/", response_model=Product)
def create_product(product: Product, session: Session = Depends(get_session)):
    # 'session' es nuestra conexión a la DB inyectada automáticamente
    session.add(product)      # Preparamos el producto para guardar
    session.commit()          # Confirmamos el cambio en la DB
    session.refresh(product)  # Recargamos el objeto con el ID generado por la DB
    return product

# 2. Endpoint para LISTAR todos los productos (GET)
@router.get("/", response_model=list[Product])
def read_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products