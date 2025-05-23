import React, { useState, useEffect } from "react";

interface VariantMatrixProps {
    options: { name: string; options: string[] }[];
}

interface RowData {
    price: string;
    stock: string;
    code: string;
    image: File | null;
}

const VariantMatrixTable: React.FC<VariantMatrixProps> = ({ options }) => {
    const [rows, setRows] = useState<RowData[]>([]);

    const combinations = options[0].options.flatMap((opt1) =>
        options[1].options.map((opt2) => [opt1, opt2])
    );

    useEffect(() => {
        setRows((prev) => {
            const newRows = combinations.map((_, i) => prev[i] || {
                price: "",
                stock: "",
                code: "",
                image: null,
            });
            return newRows;
        });
    }, [options]);

    const handleChange = (index: number, field: keyof RowData, value: any) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    return (
        <div className="mt-6 overflow-x-auto">
            <h4 className="text-md font-semibold mb-2">Daftar Varian</h4>
            <table className="w-full text-sm border border-gray-200">
                <thead className="bg-purple-100 text-gray-700">
                    <tr>
                        {options.map((opt, i) => (
                            <th key={i} className="p-2 text-left">{opt.name}</th>
                        ))}
                        <th className="p-2 text-left">Harga</th>
                        <th className="p-2 text-left">Stok</th>
                        <th className="p-2 text-left">Kode Varian</th>
                        <th className="p-2 text-left">Gambar</th>
                    </tr>
                </thead>
                <tbody>
                    {options[0].options.map((aroma, aromaIdx) => {
                        return options[1].options.map((volume, volIdx) => {
                            const rowIndex = aromaIdx * options[1].options.length + volIdx;
                            return (
                                <tr key={rowIndex} className="border-t text-gray-700">
                                    {volIdx === 0 && (
                                        <td
                                            rowSpan={options[1].options.length}
                                            className="p-2 align-top text-sm font-medium"
                                        >
                                            <div>{aroma}</div>
                                            <div className="mt-2">
                                                <label className="block border border-dashed border-gray-400 rounded-md h-24 w-24 flex flex-col items-center justify-center cursor-pointer text-xs text-gray-500 text-center">
                                                    <span className="text-xl">＋</span>
                                                    Tambah Gambar
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleChange(rowIndex, "image", e.target.files?.[0] || null)
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                    )}
                                    <td className="p-2">{volume}</td>
                                    <td className="p-2">
                                        <div className="flex items-center border px-2 py-1 rounded w-28">
                                            <span className="text-gray-500 mr-1">Rp.</span>
                                            <input
                                                type="text"
                                                className="w-full outline-none"
                                                value={rows[rowIndex]?.price}
                                                onChange={(e) => handleChange(rowIndex, "price", e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center border px-2 py-1 rounded w-24">
                                            <input
                                                type="text"
                                                className="w-full outline-none"
                                                value={rows[rowIndex]?.stock}
                                                onChange={(e) => handleChange(rowIndex, "stock", e.target.value)}
                                            />
                                            <span className="text-gray-500 ml-1">G</span>
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-28 border px-2 py-1 rounded"
                                            placeholder="Kode"
                                            value={rows[rowIndex]?.code}
                                            onChange={(e) => handleChange(rowIndex, "code", e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        {rows[rowIndex]?.image ? (
                                            <div className="w-24 h-24 rounded border overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(rows[rowIndex].image)}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400 italic">Belum ada</div>
                                        )}
                                    </td>
                                </tr>
                            );
                        });
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VariantMatrixTable;
