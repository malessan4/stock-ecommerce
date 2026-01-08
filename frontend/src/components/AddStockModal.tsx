'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number | null; // Necesitamos saber a QUÉ producto sumarle
    productName: string;
}

export default function AddStockModal({ isOpen, onClose, productId, productName }: ModalProps) {
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(1); // Empezamos con 1 por defecto

    const mutation = useMutation({
        mutationFn: async () => {
            // Llamamos al endpoint de MOVIMIENTOS
            return await api.post('/movements/', {
                product_id: productId,
                type: 'in', // 'in' = Entrada de mercadería
                quantity: quantity
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Refrescamos la tabla
            onClose();
            setQuantity(1);
            alert(`✅ Se agregaron ${quantity} unidades a ${productName}`);
        },
        onError: (error: any) => {
            alert("❌ Error: " + (error.response?.data?.detail || "Algo salió mal"));
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (productId) mutation.mutate();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900">Agregar Stock</h2>
                <p className="text-sm text-gray-500 mb-4">Producto: <span className="font-bold text-blue-600">{productName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-900">Cantidad a ingresar</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 outline-none text-lg font-bold"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition font-bold"
                    >
                        {mutation.isPending ? 'Procesando...' : 'Confirmar Entrada'}
                    </button>
                </form>
            </div>
        </div>
    );
}