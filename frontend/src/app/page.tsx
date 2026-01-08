'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import { Package, AlertCircle, Plus, PackagePlus } from 'lucide-react'; // ⬅️ Nuevo icono
import CreateProductModal from '@/components/CreateProductModal';
import AddStockModal from '@/components/AddStockModal'; // ⬅️ 1. Importamos el nuevo modal

interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ⬅️ 2. Estados para el Modal de Stock
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number, name: string } | null>(null);

  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products/');
      return response.data;
    },
  });

  // Función auxiliar para abrir el modal de stock
  const openStockModal = (product: Product) => {
    setSelectedProduct({ id: product.id, name: product.name });
    setIsStockModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Control de Inventario</h1>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {isLoading && <p className="text-blue-500 animate-pulse">Cargando productos...</p>}

        {isError && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle />
            <p>Error al conectar con el Backend.</p>
          </div>
        )}

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
                  <th className="p-4 text-center">Acciones</th> {/* ⬅️ Nueva columna */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition group">
                      <td className="p-4 text-gray-500">#{product.id}</td>
                      <td className="p-4 font-medium text-gray-800">{product.name}</td>
                      <td className="p-4">
                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {product.sku}
                        </span>
                      </td>
                      <td className="p-4 text-green-600 font-bold">${product.price}</td>
                      <td className={`p-4 font-bold ${product.stock === 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        {product.stock} u.
                      </td>

                      {/* ⬅️ Botón de Acción */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => openStockModal(product)}
                          className="text-gray-400 hover:text-green-600 hover:bg-green-50 p-2 rounded-full transition tooltip"
                          title="Agregar Stock"
                        >
                          <PackagePlus size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Crear Producto */}
        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* ⬅️ 3. Modal de Agregar Stock */}
        <AddStockModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          productId={selectedProduct?.id || null}
          productName={selectedProduct?.name || ''}
        />

      </div>
    </main>
  );
}