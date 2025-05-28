import { Toaster } from "@/core/helpers/BaseAlert";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import InputDiscountSelect from "@/views/components/Input-v2/InputDiscountSelect";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 15 data outlet & barang
const outletOptions = [
  "Outlet 1", "Outlet 2", "Outlet 3", "Outlet 4", "Outlet 5",
  "Outlet 6", "Outlet 7", "Outlet 8", "Outlet 9", "Outlet 10",
  "Outlet 11", "Outlet 12", "Outlet 13", "Outlet 14", "Outlet 15"
];
const barangOptions = [
  "Parfum A", "Parfum B", "Parfum C", "Parfum D", "Parfum E",
  "Parfum F", "Parfum G", "Parfum H", "Parfum I", "Parfum J",
  "Parfum K", "Parfum L", "Parfum M", "Parfum N", "Parfum O"
];

const mockData = [
  { id: 1, name: "Parfum Siang", date: "2025-01-19", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 500000, status: "Berlaku", outlet: "Outlet 1", barang: "Parfum A", startDate: "2025-01-10", endDate: "2025-01-19" },
  { id: 2, name: "Parfum Malam", date: "2025-01-19", kategori: "Oli Samping", stok: "300 G", hargaNormal: "Rp.250.000", hargaDiskon: 400000, status: "Berlaku", outlet: "Outlet 2", barang: "Parfum B", startDate: "2025-01-11", endDate: "2025-01-19" },
];

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <label className="block mb-1 text-sm text-gray-700">{label}</label>
      <div
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
      >
        {value || placeholder || "Pilih"}
      </div>
      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
            placeholder={`Cari ${label.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            onClick={e => e.stopPropagation()}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-400 text-sm">Tidak ditemukan</div>
            )}
            {filteredOptions.map((opt, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${opt === value ? "bg-blue-100" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const DiscountEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

  const [discountType, setDiscountType] = useState("Rp");
  const [discountValue, setDiscountValue] = useState(0);
  const [minPurchase, setMinPurchase] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedBarang, setSelectedBarang] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [namaDiskon, setNamaDiskon] = useState("");

  useEffect(() => {
    const Discount = mockData.find((u) => String(u.id) === String(id));
    if (!Discount) {
      navigate("/discounts");
      Toaster('error', "Discount not found");
    } else {
      setNamaDiskon(Discount.name);
      setDiscountValue(Number(Discount.hargaDiskon));
      setSelectedOutlet(Discount.outlet || "");
      setSelectedBarang(Discount.barang || "");
      setStartDate(Discount.startDate || "");
      setEndDate(Discount.endDate || "");
      // setMinPurchase( ... ) // jika ada field minimum pembelian di data
    }
  }, [id, navigate]);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Edit Diskon Produk" desc="Edit Diskon Untuk Produk Anda" />

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Diskon</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Nama Diskon</label>
            <input
              type="text"
              value={namaDiskon}
              onChange={e => setNamaDiskon(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Digunakan Maksimal</label>
            <InputNumber
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan jumlah maksimal"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Minimum pembelian</label>
            <InputNumber
              labelClass={labelClass}
              placeholder="500.000"
              prefix="Rp"
              value={minPurchase}
              onChange={e => setMinPurchase(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <SearchableSelect
            label="Outlet"
            options={outletOptions}
            value={selectedOutlet}
            onChange={setSelectedOutlet}
            placeholder="Pilih Outlet"
          />
          <SearchableSelect
            label="Nama Barang"
            options={barangOptions}
            value={selectedBarang}
            onChange={setSelectedBarang}
            placeholder="Pilih Barang"
          />
        </div>

        {/* Input tanggal dimulai dan tanggal berakhir */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Tanggal Dimulai</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Tanggal Berakhir</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
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