import os
from sqlmodel import SQLModel, create_engine, Session

# Leemos la URL desde la variable de entorno que pusimos en docker-compose
DATABASE_URL = os.environ.get("DATABASE_URL")

# Creamos el motor de conexión
engine = create_engine(DATABASE_URL)

# Función para crear las tablas al iniciar la app
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependencia para obtener la sesión de DB (la usaremos en los endpoints)
def get_session():
    with Session(engine) as session:
        yield session