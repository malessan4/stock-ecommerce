'use client';

import { useState } from 'react'; // ⬅️ 1. Importamos useState para manejar el modal
import { useQuery } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import { Package, AlertCircle, Plus } from 'lucide-react'; // ⬅️ 2. Agregamos el icono 'Plus'
import CreateProductModal from '@/components/CreateProductModal'; // ⬅️ 3. Importamos tu componente Modal

// Definimos el tipo de dato que esperamos
interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export default function Home() {
  // ⬅️ 4. Estado para controlar si el modal se ve o no
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Consulta de datos (React Query)
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products/');
      return response.data;
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Encabezado: Ahora usamos flex justify-between para separar título y botón */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Control de Inventario</h1>
          </div>

          {/* ⬅️ 5. Botón para abrir el modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* Estado de Carga */}
        {isLoading && <p className="text-blue-500 animate-pulse">Cargando productos...</p>}

        {/* Estado de Error */}
        {isError && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle />
            <p>Error al conectar con el Backend. ¿Está encendido Docker?</p>
          </div>
        )}

        {/* Tabla de Datos */}
        {products && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No hay productos registrados. ¡Crea el primero!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-500">#{product.id}</td>
                      <td className="p-4 font-medium text-gray-800">{product.name}</td>
                      <td className="p-4">
                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {product.sku}
                        </span>
                      </td>
                      <td className="p-4 text-green-600 font-bold">${product.price}</td>
                      <td className={`p-4 font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                        {product.stock} u.
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ⬅️ 6. Renderizamos el Modal al final */}
        {/* Le pasamos el estado 'isOpen' y la función para cerrarlo */}
        <CreateProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </main>
  );
}