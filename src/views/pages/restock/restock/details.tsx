import { useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ChevronDown, ChevronUp, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dummyDetail = {
    warehouse: {
        name: "Warehouse A",
        address: "Jl Ahmad Yani No 23 RT 4 Rw 5...",
        phone: "(+62) 811-0220-0010",
        image: "/images/big/img8.jpg",
    },
    transaksi: {
        tanggal: "01 Januari 2025",
        produkDipilih: 3,
        status: "Selesai",
    },
    products: [
        {
            id: 1,
            name: "Alkohol 70%",
            category: "Parfum Siang",
            variants: [
                { id: "PR001-01", name: "Varian 01", code: "PR001-01", qty: 1000, unit: "G" },
                { id: "PR001-02", name: "Varian 02", code: "PR001-02", qty: 1000, unit: "G" },
                { id: "PR001-03", name: "Varian 03", code: "PR001-03", qty: 1000, unit: "G" },
            ],
            image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%",
        },
        {
            id: 2,
            name: "Alkohol 70%",
            category: "Bahan Parfum",
            variants: [
                { id: "PR001-01", name: "Varian 01", code: "PR001-01", qty: 1000, unit: "G" },
                { id: "PR001-02", name: "Varian 02", code: "PR001-02", qty: 1000, unit: "G" },
                { id: "PR001-03", name: "Varian 03", code: "PR001-03", qty: 1000, unit: "G" },
            ],
            image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%",
        },
        {
            id: 3,
            name: "Alkohol 70%",
            category: "Bahan Parfum",
            variants: [
                { id: "PR001-01", name: "Varian 01", code: "PR001-01", qty: 1000, unit: "G" },
                { id: "PR001-02", name: "Varian 02", code: "PR001-02", qty: 1000, unit: "G" },
                { id: "PR001-03", name: "Varian 03", code: "PR001-03", qty: 1000, unit: "G" },
            ],
            image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%",
        },
    ],
};

export const RestockDetail = () => {
    const navigate = useNavigate();
    const [openTable, setOpenTable] = useState(null);

    return (
        <div className="p-6 space-y-6 bg-[#F8F9FB] min-h-screen">
            <Breadcrumb
                title="Detail Request Stock"
                desc="Detail informasi request stock yang telah dibuat"
            />
            <div className="bg-white rounded-xl shadow-md p-8 flex-col md:flex-row gap-8">
                <button
                    className="flex items-center gap-2 text-blue-600 font-semibold mb-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} /> Kembali
                </button>
                <div className="flex flex-col md:flex-row gap-8 mt-5">
                    <img
                        src={dummyDetail.warehouse.image}
                        alt=""
                        className="w-44 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1 flex flex-col gap-2 justify-between">
                        <div className="font-semibold text-lg">{dummyDetail.warehouse.name}</div>
                        <div className="text-gray-500 text-sm">{dummyDetail.warehouse.address}</div>
                        <div className="text-gray-500 text-sm">{dummyDetail.warehouse.phone}</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="font-semibold text-lg">Transaksi</div>
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex">
                                <div className="w-28 text-gray-500">Tanggal</div>
                                <div>: {dummyDetail.transaksi.tanggal}</div>
                            </div>
                            <div className="flex">
                                <div className="w-28 text-gray-500">Produk dipilih</div>
                                <div>: {dummyDetail.transaksi.produkDipilih} Produk</div>
                            </div>
                            <div className="flex">
                                <div className="w-28 text-gray-500">Status</div>
                                <div>
                                    :{" "}
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold ml-1">
                                        {dummyDetail.transaksi.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="font-semibold mb-4">Produk Dipilih :</div>
                <div className="space-y-6">
                    {dummyDetail.products.map((item) => (
                        <div key={item.id} className="mt-6 border border-gray-300 rounded-md p-5 bg-[#FAFBFC]">
                            <div className="flex gap-5">
                                <img src={item.image} className="w-40 border border-gray-300 rounded-md" alt="Product" />
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between">
                                        <h1 className="font-semibold text-xl">{item.name}</h1>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-400">Kategori</p>
                                            <p className="font-semibold">{item.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Varian Dipilih</p>
                                            <p className="font-semibold">{item.variants.length} Varian</p>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => setOpenTable(openTable === item.id ? null : item.id)}>
                                            <p className="text-xs text-gray-400">Detail</p>
                                            <p className="font-semibold">{openTable === item.id ? <ChevronUp /> : <ChevronDown />}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {openTable === item.id && (
                                <div className="mt-6 overflow-x-auto">
                                    <table className="w-full min-w-[800px] text-sm">
                                        <thead className="bg-gray-100 border border-gray-300 text-gray-700">
                                            <tr>
                                                <th className="p-4 font-medium text-left">No</th>
                                                <th className="p-4 font-medium text-left">Nama Varian</th>
                                                <th className="p-4 font-medium text-left">Kode Varian</th>
                                                <th className="p-4 font-medium text-left">Jumlah Request Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.variants.map((variant, i) => (
                                                <tr key={variant.id} className="hover:bg-gray-50">
                                                    <td className="p-6 align-top">{i + 1}</td>
                                                    <td className="p-6 align-top">{variant.name}</td>
                                                    <td className="p-6 align-top">{variant.code}</td>
                                                    <td className="p-6 align-top">
                                                        <div className="w-60">
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="number"
                                                                    className="w-full border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-50"
                                                                    value={variant.qty}
                                                                    readOnly
                                                                />
                                                                <span className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg bg-gray-100 text-sm">
                                                                    {variant.unit}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};