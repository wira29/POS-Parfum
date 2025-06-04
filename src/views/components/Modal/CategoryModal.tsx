import React, { useState, useEffect } from "react";
import { X } from "react-feather";

interface Category {
    name: string;
    status: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Category) => void;
    initialData?: Category | null;
}

const CategoryModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [status, setStatus] = useState(initialData?.status ?? true);

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setStatus(initialData.status);
        } else if (isOpen && !initialData) {
            setName("");
            setStatus(true);
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, status });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <div className="bg-white rounded-md w-full max-w-md p-0 shadow-lg relative">
                <div className="flex justify-between items-center rounded-t-md px-6 py-4 mb-4 bg-blue-600">
                    <h2 className="text-lg font-bold text-white">
                        {initialData ? "Edit Kategori" : "Buat Kategori Baru"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-200 text-xl font-bold"
                    >
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nama Kategori"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={status}
                                onChange={() => setStatus(!status)}
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                            Batalkan
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-white ${initialData ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {initialData ? "Simpan" : "Buat"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
