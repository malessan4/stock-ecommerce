from typing import Optional
from sqlmodel import Field, SQLModel

# Heredamos de SQLModel
class Product(SQLModel, table=True):
    # 'table=True' le dice que cree una tabla en Postgres llamada 'product'
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)  # index=True hace las búsquedas rápidas
    sku: str = Field(unique=True, index=True) # SKU único, no pueden repetirse
    description: Optional[str] = None
    price: float
    stock: int = Field(default=0)