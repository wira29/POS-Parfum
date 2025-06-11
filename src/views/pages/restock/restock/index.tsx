import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";
import ViewIcon from "@/views/components/ViewIcon";  
import { useNavigate } from "react-router-dom";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  warehouseFilter,
  setwarehouseFilter,
  produkFilter,
  setProdukFilter,
  setStatusFilter,
  kategoriFilter,
  setKategoriFilter,
  kategoriOptions,
  produkOptions,
  warehouseOptions,
}: {
  open: boolean;
  onClose: () => void;
  warehouseFilter: string;
  setwarehouseFilter: (val: string) => void;
  produkFilter: string;
  setProdukFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  kategoriFilter: string;
  setKategoriFilter: (val: string) => void;
  kategoriOptions: string[];
  produkOptions: string[];
  warehouseOptions: string[];
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[700px] min-h-[600px]">
        <div className="font-semibold text-lg mb-4">Filter Restock Produk</div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Status</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Dikirim">Dikirim</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Kategori Produk</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={kategoriFilter}
            onChange={e => setKategoriFilter(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((kat, idx) => (
              <option key={idx} value={kat}>{kat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Warehouse</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={warehouseFilter}
            onChange={e => setwarehouseFilter(e.target.value)}
          >
            <option value="">Semua Warehouse</option>
            {warehouseOptions.map((wh, idx) => (
              <option key={idx} value={wh}>{wh}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Produk</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={produkFilter}
            onChange={e => setProdukFilter(e.target.value)}
          >
            <option value="">Semua Produk</option>
            {produkOptions.map((prod, idx) => (
              <option key={idx} value={prod}>{prod}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

interface RestockItem {
  id: number;
  warehouse: string;
  tanggal: string;
  produk: string;
  kategori: string;
  stok: string;
  qty: string;
  status: "Menunggu" | "Diproses" | "Dikirim" | "Selesai";
}

export const RestockIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<RestockItem | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [warehouseFilter, setwarehouseFilter] = useState("");
  const [produkFilter, setProdukFilter] = useState("");
  const [inputWarehouse, setInputWarehouse] = useState("");
  const [inputProduct, setInputProduct] = useState("");
  const itemsPerPage = 5;
  const nav = useNavigate();

  const mockData: RestockItem[] = [
    {
      id: 1,
      warehouse: "Gudang A",
      tanggal: "19/01/2025",
      produk: "Parfum A",
      kategori: "Parfum Siang",
      stok: "200 Gram",
      qty: "2000 Gram",
      status: "Menunggu",
    },
    {
      id: 2,
      warehouse: "Gudang A",
      tanggal: "19/01/2025",
      produk: "Parfum A",
      kategori: "Parfum Siang",
      stok: "200 Gram",
      qty: "2000 Gram",
      status: "Diproses",
    },
    {
      id: 3,
      warehouse: "Gudang A",
      tanggal: "19/01/2025",
      produk: "Parfum A",
      kategori: "Parfum Siang",
      stok: "200 Gram",
      qty: "2000 Gram",
      status: "Dikirim",
    },
    {
      id: 4,
      warehouse: "Gudang A",
      tanggal: "19/01/2025",
      produk: "Parfum A",
      kategori: "Parfum Siang",
      stok: "200 Gram",
      qty: "2000 Gram",
      status: "Selesai",
    },
    {
      id: 5,
      warehouse: "Gudang A",
      tanggal: "20/01/2025",
      produk: "Parfum B",
      kategori: "Parfum Malam",
      stok: "100 Gram",
      qty: "1000 Gram",
      status: "Menunggu",
    },
    {
      id: 6,
      warehouse: "Gudang B",
      tanggal: "21/01/2025",
      produk: "Parfum C",
      kategori: "Parfum Sore",
      stok: "150 Gram",
      qty: "1200 Gram",
      status: "Selesai",
    },
  ];

  const kategoriOptions = Array.from(new Set(mockData.map(d => d.kategori)));
  const produkOptions = Array.from(new Set(mockData.map(d => d.produk)));
  const warehouseOptions = Array.from(new Set(mockData.map(d => d.warehouse)));

  const filteredData = mockData.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.produk.toLowerCase().includes(q) ||
      item.kategori.toLowerCase().includes(q) ||
      item.warehouse.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.tanggal.toLowerCase().includes(q) ||
      item.stok.toLowerCase().includes(q) ||
      item.qty.toLowerCase().includes(q);

    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const matchKategori = kategoriFilter ? item.kategori === kategoriFilter : true;
    const matchWarehouse = warehouseFilter ? item.warehouse === warehouseFilter : true;
    const matchProduk = produkFilter ? item.produk === produkFilter : true;

    return matchSearch && matchStatus && matchKategori && matchWarehouse && matchProduk;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRestockModalSubmit = (data: { warehouse: string; produk: string; qty: string }) => {
    setModalOpen(false);
    setEditingData(null);
  };
  function dellete() {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data restock akan dihapus!",
      icon: 'question'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      if (result.isConfirmed) {
        Toaster('success', "Restock berhasil dihapus");
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Restock Produk" desc="Menampilkan daftar restock dari gudang" />

      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter onClick={() => setShowFilter(true)} />
          </div>
          <div className="w-full sm:w-auto">
            <AddButton onClick={() => nav("/restock/create")}>
              Tambah Restock
            </AddButton>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Produk</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Varian</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{item.tanggal}</td>
                    <td className="px-6 py-4">{item.produk}</td>
                    <td className="px-6 py-4">{item.kategori}</td>
                    <td className="px-6 py-4">biasalah</td>
                    <td className="px-6 py-4">{item.qty}</td>
                    <td className="px-6 py-4">
                      <ViewIcon to={`/restock/${item.id}/details`} className="w-8"/>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
          <span className="text-gray-700">{filteredData.length} Data</span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={val => setStatusFilter(val)}
        kategoriFilter={kategoriFilter}
        setKategoriFilter={val => setKategoriFilter(val)}
        kategoriOptions={kategoriOptions}
        warehouseFilter={warehouseFilter}
        setwarehouseFilter={val => setwarehouseFilter(val)}
        produkFilter={produkFilter}
        setProdukFilter={val => setProdukFilter(val)}
        produkOptions={produkOptions}
        warehouseOptions={warehouseOptions}
      />
    </div>
  );
};