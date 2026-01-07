from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Movement, Product, MovementType
from app.schemas import MovementCreate, MovementRead

router = APIRouter(prefix="/movements", tags=["movements"])

@router.post("/", response_model=MovementRead)
def create_movement(movement_in: MovementCreate, session: Session = Depends(get_session)):
    # 1. Buscar el producto
    product = session.get(Product, movement_in.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # 2. Validar lógica de negocio (No vender lo que no tienes)
    if movement_in.type == MovementType.outbound:
        if product.stock < movement_in.quantity:
            raise HTTPException(status_code=400, detail="Stock insuficiente")
        # Restar stock
        product.stock -= movement_in.quantity
        
    elif movement_in.type == MovementType.inbound:
        # Sumar stock
        product.stock += movement_in.quantity
    
    else:
        raise HTTPException(status_code=400, detail="Tipo de movimiento inválido (use 'in' o 'out')")

    # 3. Crear el objeto Movimiento
    movement = Movement(
        product_id=movement_in.product_id,
        type=movement_in.type,
        quantity=movement_in.quantity
    )

    # 4. Guardar AMBOS cambios (Movimiento y Producto actualizado)
    session.add(movement)
    session.add(product) # Marcamos el producto para actualizarse
    session.commit()
    
    session.refresh(movement)
    return movement