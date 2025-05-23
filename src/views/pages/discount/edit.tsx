import { Toaster } from "@/core/helpers/BaseAlert";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import InputDiscountSelect from "@/views/components/Input-v2/InputDiscountSelect";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const mockData = [
    { id: 1, name: "Parfum Siang", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 2, name: "Parfum Malam", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 3, name: "Parfum Sore", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 4, name: "Parfum Pagi", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 5, name: "Parfum Pria", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 6, name: "Ban Depan", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 7, name: "Velg BMW", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 8, name: "Shogun RWB", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 9, name: "Parfum Perempuan", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 10, name: "Makanan Kuda", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
    { id: 11, name: "Dedek", date: "19/1/2025", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku" },
];

export const DiscountEdit = () => {
    const [discountType, setDiscountType] = useState("Rp");
    const [discountValue, setDiscountValue] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        discountValue: 0,
        productKategori: "",
        productName: "",
        date: "",
    });

useEffect(() => {
    const Discount = mockData.find((u) => String(u.id) === String(id));
    if (!Discount) {
        navigate("/discounts");
        Toaster('error', "Discount not found");
    } else {
        setForm({
            discountValue: Discount.hargaDiskon,
            productKategori: Discount.kategori,
            productName: Discount.name,
            date: Discount.date,
        });
        setDiscountValue(Number(Discount.hargaDiskon));
    }
}, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb title="Edit Diskon Produk" desc="Edit Diskon Untuk Produk Anda" />

            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Edit Diskon</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm text-gray-700">Kategori Barang</label>
                        <select
                            name="productKategori"
                            value={form.productKategori}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Oli Samping">Oli Samping</option>
                            <option value="Parfum">Parfum</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700">Nama Barang</label>
                        <select
                            name="productName"
                            value={form.productName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Pilih Barang</option>
                            {mockData
                                .filter((item) => item.kategori === form.productKategori)
                                .map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputDiscountSelect
                            label="Atur Diskon"
                            labelClass="block mb-1 text-sm text-gray-700"
                            discountType={discountType}
                            onDiscountTypeChange={(e) => setDiscountType(e.target.value)}
                            discountValue={discountValue}
                            onDiscountValueChange={(e) => setDiscountValue(Number(e.target.value))}
                            placeholder="Masukkan nilai diskon"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700">Waktu Dimulai</label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-5 justify-end">
                    <button onClick={() => navigate("/discounts")} className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-6 py-2 rounded-md">
                        Kembali
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};