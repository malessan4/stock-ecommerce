from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
from enum import Enum

# 1. Base: Lo que tienen en común todos (para no repetir código)
class ProductBase(SQLModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float

# 2. Input: Lo que el usuario nos manda para CREAR
# Fíjate que NO tiene 'id' ni 'stock'. Así protegemos esos campos.
class ProductCreate(ProductBase):
    pass 

# 3. Output: Lo que nosotros devolvemos al leer
# Aquí sí incluimos el 'id' y el 'stock' para que el frontend los vea.
class ProductRead(ProductBase):
    id: int
    stock: int

class MovementCreate(SQLModel):
    product_id: int
    type: str # Debería ser 'in' o 'out'
    quantity: int

class MovementRead(MovementCreate):
    id: int
    date: datetime