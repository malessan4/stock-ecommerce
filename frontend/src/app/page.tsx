'use client'; // Necesario para usar hooks como useQuery

import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import { Package, AlertCircle } from 'lucide-react'; 

// Definimos el tipo de dato que esperamos (Igual que en tu backend schema)
interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export default function Home() {
  // 1. Usamos React Query para pedir los datos
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'], // Clave única para caché
    queryFn: async () => {
      const response = await api.get('/products/');
      return response.data;
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Control de Inventario</h1>
        </div>

        {/* 2. Estado de Carga */}
        {isLoading && <p className="text-blue-500">Cargando productos...</p>}

        {/* 3. Estado de Error */}
        {isError && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
            <AlertCircle />
            <p>Error al conectar con el Backend. ¿Está encendido Docker?</p>
          </div>
        )}

        {/* 4. Tabla de Datos */}
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{product.id}</td>
                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded w-fit">
                      {product.sku}
                    </td>
                    <td className="p-4 text-green-600 font-bold">${product.price}</td>
                    <td className={`p-4 font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stock} u.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}