import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import { useState, useEffect } from "react";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import { Filter } from "@/views/components/Filter";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";
import ViewIcon from "@/views/components/ViewIcon";
import { useApiClient } from "@/core/helpers/ApiClient";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  kategoriFilter,
  setKategoriFilter,
  kategoriOptions,
  onApplyFilter,
}: {
  open: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  kategoriFilter: string;
  setKategoriFilter: (val: string) => void;
  kategoriOptions: string[];
  onApplyFilter: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <div className="font-semibold text-lg mb-4">Filter Diskon</div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Status</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="1">Berlaku</option>
            <option value="0">Tidak Berlaku</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Kategori Produk</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((kat, idx) => (
              <option key={idx} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={() => {
              onApplyFilter();
              onClose();
            }}
          >
            Terapkan
          </button>
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

interface Voucher {
  id: string;
  name: string;
  expired: string | null;
  min: number;
  max_used: number;
  discount: number;
  used: number;
  active: number;
  store: {
    id: string;
    name: string;
  };
}

export default function DiscountIndex() {
  const ApiClient = useApiClient();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const kategoriOptions = ["Parfum", "Makeup", "Skincare", "Aksesoris"];

  async function fetchVouchers(page = 1) {
    setLoading(true);
    setError(null);
    try {
      let url = `/discount-vouchers?per_page=${perPage}&page=${page}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (statusFilter !== "") {
        url += `&active=${statusFilter}`;
      }
      if (kategoriFilter !== "") {
        url += `&category=${encodeURIComponent(kategoriFilter)}`;
      }

      const response = await ApiClient.get(url);

      if (response.data.success) {
        const apiData = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          expired: item.expired,
          min: item.min,
          max_used: item.max_used,
          discount: item.discount,
          used: item.used,
          active: item.active,
          store: {
            id: item.store.id,
            name: item.store.name,
          },
        }));

        setVouchers(apiData);
        setTotalPages(response.data.pagination.last_page);
        setTotalItems(response.data.pagination.total);
        setCurrentPage(response.data.pagination.current_page);
      } else {
        setVouchers([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError("Gagal mengambil data diskon");
      setVouchers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVouchers(currentPage);
  }, [currentPage, searchQuery, statusFilter, kategoriFilter]);

  function onPageChange(page: number) {
    setCurrentPage(page);
  }

  function deleteVoucher(id: string) {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data diskon akan dihapus!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ApiClient.delete(`/discount-vouchers/${id}`);
          Toaster("success", "Diskon berhasil dihapus");
          fetchVouchers(currentPage);
        } catch (error) {
          Toaster("error", "Gagal menghapus diskon");
        }
      }
    });
  }

  function applyFilter() {
    setCurrentPage(1);
  }

  

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Diskon Produk" desc="Menampilkan diskon yang aktif" />
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
            <Filter onClick={() => setShowFilter(true)} />
          </div>
          <div className="w-full sm:w-auto">
            <AddButton to="/discounts/create">Buat Diskon</AddButton>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Diskon</th>
                <th className="px-6 py-4 font-medium">Produk Variant</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Nilai</th>
                <th className="px-6 py-4 font-medium">Tanggal Berakhir</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
              {vouchers.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <h1 className="font-semibold">Variant 1</h1>
                      <h1>PROO1-1</h1>
                    </div>
                  </td>
                  <td className="px-6 py-4">Parfume Siang</td>
                  <td className="px-6 py-4">{item.discount <= 100 ? `% ${item.discount}` : "Rp.100.000"}</td>
                  <td className="px-6 py-4">{item.expired === null ? "-" : item.expired}</td>
                  <td className="px-6 py-4">
                    {item.active === 1 ? (
                      <span className="text-green-600 font-semibold bg-green-50 py-1.5 px-5 rounded-lg">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold bg-red-50 py-1.5 px-5 rounded-lg">
                        Tidak Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <ViewIcon to={`/discounts/${item.id}/detail`} />
                      <EditIcon
                        to={`/discounts/${item.id}/edit`}
                        className="text-blue-500 hover:text-blue-700"
                      />
                      <DeleteIcon onClick={() => deleteVoucher(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={(page) => setCurrentPage(page)}
          totalItems={67}
          itemsPerPage={8}
          showInfo={true}
        />
      </div>

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        kategoriFilter={kategoriFilter}
        setKategoriFilter={setKategoriFilter}
        kategoriOptions={kategoriOptions}
        onApplyFilter={applyFilter}
      />
    </div>
  );
}
