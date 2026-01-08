'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateProductModal({ isOpen, onClose }: ModalProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: 0,
    });

    const mutation = useMutation({
        mutationFn: async (newProduct: typeof formData) => {
            return await api.post('/products/', newProduct);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            onClose();
            setFormData({ name: '', sku: '', description: '', price: 0 });
            alert("✅ Producto creado con éxito");
        },
        onError: (error: any) => {
            alert("❌ Error: " + (error.response?.data?.detail || "Algo salió mal"));
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        // CORRECCIÓN 1: Usamos bg-black/50 para que sea semitransparente (gris oscuro), no negro sólido
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900">Nuevo Producto</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {/* CORRECCIÓN 2: Labels más oscuros (text-gray-900) */}
                        <label className="block text-sm font-bold text-gray-900">Nombre</label>
                        <input
                            type="text"
                            required
                            // CORRECCIÓN 3: Texto negro (text-gray-900) y fondo blanco explícito
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Laptop Gamer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900">SKU (Código único)</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 uppercase text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                            placeholder="Ej: LPT-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900">Descripción</label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
                    >
                        {mutation.isPending ? 'Guardando...' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </div>
    );
}