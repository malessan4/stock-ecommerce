from fastapi import FastAPI

# Metadatos para la documentación automática
app = FastAPI(
    title="Inventory System API",
    description="API para gestión de inventario profesional usando FastAPI y SQLModel",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido al Sistema de Inventario", "estado": "funcionando"}