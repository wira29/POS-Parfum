import { Breadcrumb } from "@/views/components/Breadcrumb";
import InputDiscountSelect from "@/views/components/Input-v2/InputDiscountSelect";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DiscountCreate = () => {
  const [discountType, setDiscountType] = useState("Rp");
  const [discountValue, setDiscountValue] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Buat Diskon Produk" desc="Buat Diskon Untuk Produk Anda" />

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Buat Diskon</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Kategori Barang</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Parfum Siang</option>
              <option>Parfum Malam</option>
              <option>Parfum Sore</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Nama Barang</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Parfum A</option>
              <option>Parfum B</option>
              <option>Parfum C</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Waktu Berakhir</label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="date"
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
            Buat Diskon
          </button>
        </div>
      </div>
    </div>
  );
};