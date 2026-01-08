from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from app.database import get_session
from app.models import Product
from app.schemas import ProductCreate, ProductRead

router = APIRouter(prefix="/products", tags=["products"])

# CAMBIO 1: response_model ahora es ProductRead (lo seguro)
# CAMBIO 2: product_in es de tipo ProductCreate (sin id ni stock)
@router.post("/", response_model=ProductRead)
def create_product(product_in: ProductCreate, session: Session = Depends(get_session)):
    try:
        # Convertimos el Schema (Input) a Modelo de DB
        # Esto copia name, price, sku... automáticamente
        product_db = Product.model_validate(product_in)
        
        session.add(product_db)
        session.commit()
        session.refresh(product_db)
        return product_db
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=400, detail="El SKU ya existe.")

# CAMBIO 3: response_model es una lista de ProductRead
@router.get("/", response_model=list[ProductRead])
def read_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products