'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import { X } from 'lucide-react';

// Tipos para las props (qué recibe este componente)
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateProductModal({ isOpen, onClose }: ModalProps) {
    const queryClient = useQueryClient(); // Para manipular el caché

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: 0,
    });

    // --- LA MAGIA DE REACT QUERY ---
    const mutation = useMutation({
        mutationFn: async (newProduct: typeof formData) => {
            // Enviamos el POST al backend
            return await api.post('/products/', newProduct);
        },
        onSuccess: () => {
            // Si todo sale bien:
            // 1. Avisamos a React Query que los datos viejos ya no sirven
            queryClient.invalidateQueries({ queryKey: ['products'] });
            // 2. Cerramos el modal
            onClose();
            // 3. Limpiamos el form
            setFormData({ name: '', sku: '', description: '', price: 0 });
            alert("✅ Producto creado con éxito");
        },
        onError: (error: any) => {
            // Capturamos el error 400 (ej: SKU duplicado)
            alert("❌ Error: " + (error.response?.data?.detail || "Algo salió mal"));
        }
    });

    // Manejar envío
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que se recargue la página
        mutation.mutate(formData); // Dispara la mutación
    };

    // Si no está abierto, no renderizamos nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">

                {/* Botón cerrar */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">SKU (Código único)</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 uppercase"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                        {mutation.isPending ? 'Guardando...' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </div>
    );
}