from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Importante para conectar con Next.js
from .database import create_db_and_tables
from .routers import products, movements # Importamos ambos routers

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

# --- CONFIGURACIÓN DE CORS ---
# Esto permite que tu frontend (que correrá en el puerto 3000) pueda hablar con este backend (puerto 8000)
origins = [
    "http://localhost:3000", # El puerto estándar de Next.js
    "*" # (Opcional) Permite cualquier origen, útil para pruebas rápidas
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permitir todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"], # Permitir todos los headers (Authorization, Content-Type, etc)
)
# -----------------------------

# Conectamos las rutas (endpoints) a la app principal
app.include_router(products.router)
app.include_router(movements.router)

@app.get("/")
def read_root():
    return {"mensaje": "Sistema de Inventario con DB conectada 🚀"}