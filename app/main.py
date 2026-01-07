from contextlib import asynccontextmanager
from fastapi import FastAPI
from .database import create_db_and_tables
from .models import Product # Importante importar los modelos para que SQLModel los reconozca

# Lifespan: Eventos que ocurren al arrancar o apagar la app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código que se ejecuta al inicio
    create_db_and_tables()
    print("✅ Tablas creadas en la base de datos")
    yield
    # Código que se ejecuta al apagar (si fuera necesario)

# Metadatos para la documentación automática
app = FastAPI(
    title="Inventory System API",
    description="API para gestión de inventario profesional usando FastAPI y SQLModel",
    version="1.0.0",
    lifespan=lifespan # Registramos el lifespan
)


@app.get("/")
def read_root():
    return {"mensaje": "Sistema de Inventario con DB conectada 🚀"}