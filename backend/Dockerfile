# 1. Usamos una imagen base ligera de Python
FROM python:3.10-slim

# 2. Evita que Python genere archivos .pyc y fuerza la salida por consola (bueno para logs)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /code

# 4. Copiamos primero los requirements (Estrategia de caché para que sea más rápido)
COPY requirements.txt /code/

# 5. Instalamos las dependencias
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 6. Copiamos el resto del código
COPY ./app /code/app

# 7. Comando para arrancar la app (aunque docker-compose lo puede sobreescribir)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]