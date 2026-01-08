from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel
from .schemas import ProductBase

# 1. Enums (Tipos de movimiento)
class MovementType(str, Enum):
    inbound = "in"   # Entrada
    outbound = "out" # Salida

# 2. Modelo Product (DEFINIDO UNA SOLA VEZ)
class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sku: str = Field(unique=True, index=True)
    stock: int = Field(default=0)

# 3. Modelo Movement
class Movement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id") # Relación con la tabla 'product'
    type: MovementType
    quantity: int
    date: datetime = Field(default_factory=datetime.utcnow)