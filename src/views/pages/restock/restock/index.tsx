import { useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { useNavigate } from "react-router-dom";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  warehouseFilter,
  setwarehouseFilter,
  produkFilter,
  setProdukFilter,
  kategoriFilter,
  setKategoriFilter,
  kategoriOptions,
  produkOptions,
  warehouseOptions,
}) => {
  const [searchWarehouse, setSearchWarehouse] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minRequest, setMinRequest] = useState("");
  const [maxRequest, setMaxRequest] = useState("");

  const filteredWarehouses = warehouseOptions.filter((w) =>
    w.toLowerCase().includes(searchWarehouse.toLowerCase())
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[500px] max-w-[600px] w-full">
        <div className="font-bold text-2xl mb-6">Filter Data</div>
        <div className="border-t border-gray-300 mb-6" />
        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Warehouse</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik atau pilih..."
                className="w-full border border-gray-300 rounded px-3 py-2 pr-8"
                value={searchWarehouse}
                onChange={(e) => setSearchWarehouse(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              {searchWarehouse && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 z-10 max-h-40 overflow-y-auto">
                  {filteredWarehouses.length === 0 && (
                    <div className="px-3 py-2 text-gray-400 text-sm">Tidak ditemukan</div>
                  )}
                  {filteredWarehouses.map((w, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      onClick={() => {
                        setwarehouseFilter(w);
                        setSearchWarehouse(w);
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Pilih status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Dari Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="MM-DD-YY"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Hingga Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="MM-DD-YY"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Minimum Jumlah Request</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={minRequest}
                onChange={(e) => setMinRequest(e.target.value)}
                placeholder="Ketikkan jumlah"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Maksimum Jumlah Request</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={maxRequest}
                onChange={(e) => setMaxRequest(e.target.value)}
                placeholder="Ketikkan jumlah"
              />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 mb-6" />
        <div className="flex justify-between">
          <button
            className="px-5 py-2 rounded border border-gray-300 text-gray-500 font-semibold"
            onClick={() => {
              setSearchWarehouse("");
              setStatusFilter("");
              setDateFrom("");
              setDateTo("");
              setMinRequest("");
              setMaxRequest("");
              setwarehouseFilter("");
              setProdukFilter("");
              setKategoriFilter("");
            }}
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              className="px-5 py-2 rounded border border-gray-300 text-gray-500 font-semibold"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="px-5 py-2 rounded bg-blue-600 text-white font-semibold"
              onClick={onClose}
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusMap = {
  Menunggu: {
    label: "Menunggu",
    className: "bg-gray-100 text-gray-600",
  },
  Diproses: {
    label: "Diproses",
    className: "bg-yellow-100 text-yellow-700",
  },
  Dikirim: {
    label: "Dikirim",
    className: "bg-blue-100 text-blue-600",
  },
};

const dummyRestockCards = [
  {
    id: 1,
    warehouse: "Warehouse A",
    requestDate: "01 Mei 2025",
    image: "/images/big/img8.jpg",
    status: "Menunggu",
    products: [
      {
        name: "Parfum A",
        variants: ["Varian 1", "Varian 2", "Varian 3", "Varian 4", "Varian 5"],
        selected: 5,
        request: "10.000 Gram",
        requestLabel: "Jumlah Request",
        requestColor: "text-green-600",
      },
      {
        name: "Parfum B",
        variants: ["Varian 1", "Varian 2", "Varian 3", "Varian 4", "Varian 5"],
        selected: 5,
        request: "5.000 Gram",
        requestLabel: "Stock Tersedia",
        requestColor: "text-green-600",
      },
    ],
    more: 3,
  },
  {
    id: 2,
    warehouse: "Warehouse A",
    requestDate: "01 Mei 2025",
    image: "/images/big/img8.jpg",
    status: "Diproses",
    products: [
      {
        name: "Parfum A",
        variants: ["Varian 1", "Varian 2", "Varian 3", "Varian 4", "Varian 5"],
        selected: 5,
        request: "10.000 Gram",
        requestLabel: "Jumlah Request",
        requestColor: "text-green-600",
      },
      {
        name: "Parfum B",
        variants: ["Varian 1", "Varian 2", "Varian 3", "Varian 4", "Varian 5"],
        selected: 5,
        request: "5.000 Gram",
        requestLabel: "Stock Tersedia",
        requestColor: "text-green-600",
      },
    ],
    more: 3,
  },
  {
    id: 3,
    warehouse: "Warehouse A",
    requestDate: "01 Mei 2025",
    image: "/images/big/img8.jpg",
    status: "Dikirim",
    products: [
      {
        name: "Parfum A",
        variants: ["Varian 1", "Varian 2", "Varian 3", "Varian 4", "Varian 5"],
        selected: 5,
        request: "10.000 Gram",
        requestLabel: "Jumlah Request",
        requestColor: "text-green-600",
      },
      {
        name: "Parfum B",
        variants: ["Varian 1", "Varian 2", "Varian 3", "Varian 4", "Varian 5"],
        selected: 5,
        request: "5.000 Gram",
        requestLabel: "Stock Tersedia",
        requestColor: "text-green-600",
      },
    ],
    more: 3,
  },
];

export const RestockIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [warehouseFilter, setwarehouseFilter] = useState("");
  const [produkFilter, setProdukFilter] = useState("");
  const navigate = useNavigate();

  const kategoriOptions = ["Parfum Siang", "Parfum Malam", "Parfum Sore"];
  const produkOptions = ["Parfum A", "Parfum B", "Parfum C"];
  const warehouseOptions = ["Warehouse A", "Warehouse B"];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Restock Produk"
        desc="Menampilkan daftar restock dari gudang"
      />

      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {}}
            />
            <Filter onClick={() => setShowFilter(true)} />
          </div>
          <div className="w-full sm:w-auto">
            <AddButton onClick={() => {
              navigate("/restock/create");
            }}>
              Tambah Restock
            </AddButton>
          </div>
        </div>
      </div>

      {dummyRestockCards.map((card, idx) => (
        <div key={card.id} className="bg-white shadow-md p-6 rounded-xl flex flex-col md:flex-row gap-6 items-stretch mb-6">
          <div className="flex-1 flex flex-col gap-2 justify-between">
            <div className="border border-gray-200 rounded-xl p-4">
              {card.products.map((prod, idx2) => (
                <div key={prod.name} className={`flex flex-col md:flex-row md:items-center md:justify-between py-2 ${idx2 !== 0 ? "border-t border-dashed border-gray-300 mt-2 pt-4" : ""}`}>
                  <div>
                    <div className="font-semibold">{prod.name}</div>
                    <div className="text-gray-500 text-sm">
                      {prod.variants.join(", ")}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                    <div className="font-semibold text-sm">Varian Dipilih</div>
                    <div className="text-gray-800">{prod.selected} Varian</div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                    <div className="font-semibold text-sm">{prod.requestLabel}</div>
                    <div className={`font-semibold ${prod.requestColor}`}>{prod.request}</div>
                  </div>
                </div>
              ))}
              <div className="text-center text-gray-400 text-sm mt-4">
                +{card.more} Produk Lainnya
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[220px]">
            <img
              src={card.image}
              alt=""
              className="w-44 h-28 object-cover rounded-lg mb-2"
            />
            <div className="font-semibold text-lg">{card.warehouse}</div>
            <div className="text-green-600 text-sm mb-4">
              Request pada : {card.requestDate}
            </div>
            <div className="flex gap-3 w-full justify-center">
              <button className={`${statusMap[card.status].className} px-5 py-2 rounded-md font-semibold`}>
                {statusMap[card.status].label}
              </button>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold" onClick={() => {navigate(`/restock/${card.id}/details`)}}>
                Detail
              </button>
            </div>
          </div>
        </div>
      ))}

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={(val) => setStatusFilter(val)}
        kategoriFilter={kategoriFilter}
        setKategoriFilter={(val) => setKategoriFilter(val)}
        kategoriOptions={kategoriOptions}
        warehouseFilter={warehouseFilter}
        setwarehouseFilter={(val) => setwarehouseFilter(val)}
        produkFilter={produkFilter}
        setProdukFilter={(val) => setProdukFilter(val)}
        produkOptions={produkOptions}
        warehouseOptions={warehouseOptions}
      />
    </div>
  );
};