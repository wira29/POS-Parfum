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
import { FormatTime } from "@/core/helpers/FormatTime";
import { LoadingColumn } from "@/views/components/Loading";

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  jenisFilter,
  setJenisFilter,
  setMemberFilter,
  memberFilter,
  nilaiFilter,
  setNilaiFilter,
  minNilaiFilter,
  setMinNilaiFilter,
  maxNilaiFilter,
  setMaxNilaiFilter,
  tanggalMulaiFilter,
  setTanggalMulaiFilter,
  tanggalBerakhirFilter,
  setTanggalBerakhirFilter,
  onApplyFilter,
  onResetFilter,
}: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="font-semibold text-xl mb-6 text-gray-800">
          Filter Data
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Jenis
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                >
                  <option value="">Semua</option>
                  <option value="persentage">Persen (%)</option>
                  <option value="nominal">Nominal (Rp)</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua</option>
                  <option value="1">Aktif</option>
                  <option value="0">Tidak Aktif</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Minimum Nilai Diskon
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ketikkan jumlah"
                value={minNilaiFilter}
                onChange={(e) => setMinNilaiFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tanggal Mulai
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tanggalMulaiFilter}
                  onChange={(e) => setTanggalMulaiFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Nilai
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  placeholder="Ketikkan jumlah"
                  value={nilaiFilter}
                  onChange={(e) => setNilaiFilter(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Diskon Untuk
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={memberFilter}
                  onChange={(e) => {
                    setMemberFilter(e.target.value);
                  }}
                >
                  <option value="">Semua</option>
                  <option value="1">Member</option>
                  <option value="0">Non Member</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Maksimum Nilai Diskon
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ketikkan jumlah"
                value={maxNilaiFilter}
                onChange={(e) => setMaxNilaiFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tanggal Berakhir
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tanggalBerakhirFilter}
                  onChange={(e) => setTanggalBerakhirFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-8 py-3 rounded-md cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            onClick={onResetFilter}
          >
            Reset
          </button>
          <button
            className="px-8 py-3 rounded-md cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-8 py-3 rounded-md cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
            onClick={() => {
              onApplyFilter();
              onClose();
            }}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

interface Voucher {
  id: string;
  name: string;
  end_date: string | null;
  start_date: string | null;
  min: number;
  percentage: string;
  nominal: string;
  max_used: number;
  is_member: number | string | boolean;
  discount: number;
  variant_name: string;
  code_product: string;
  category: string;
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
  const [memberFilter, setMemberFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [nilaiFilter, setNilaiFilter] = useState("");
  const [minNilaiFilter, setMinNilaiFilter] = useState("");
  const [maxNilaiFilter, setMaxNilaiFilter] = useState("");
  const [tanggalMulaiFilter, setTanggalMulaiFilter] = useState("");
  const [tanggalBerakhirFilter, setTanggalBerakhirFilter] = useState("");
  const [sortByFilter, setSortByFilter] = useState("");
  const [sortDirectionFilter, setSortDirectionFilter] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  async function fetchVouchers(page = 1) {
    setError(null);
    try {
      setLoading(true);
      let url = `/discount-vouchers?per_page=${perPage}&page=${page}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (statusFilter) {
        url += `&active=${statusFilter}`;
      }
      if (memberFilter) {
        url += `&is_member=${memberFilter}`;
      }
      if (jenisFilter) {
        url += `&type=${jenisFilter}`;
      }
      if (nilaiFilter) {
        url += `&amount=${nilaiFilter}`;
      }
      if (minNilaiFilter) {
        url += `&min_discount=${minNilaiFilter}`;
      }
      if (maxNilaiFilter) {
        url += `&max_discount=${maxNilaiFilter}`;
      }
      if (tanggalMulaiFilter) {
        url += `&start_date=${tanggalMulaiFilter}`;
      }
      if (tanggalBerakhirFilter) {
        url += `&end_date=${tanggalBerakhirFilter}`;
      }
      if (sortByFilter) {
        url += `&sort_by=${sortByFilter}`;
      }
      if (sortDirectionFilter) {
        url += `&sort_direction=${sortDirectionFilter}`;
      }

      const response = await ApiClient.get(url);

      if (response.data.success) {
        const apiData = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          start_date: FormatTime(item.start_date),
          end_date: FormatTime(item.end_date),
          is_member: item.is_member,
          nominal: item.nominal,
          type: item.type,
          percentage: item.percentage,
          min: item.minimum_purchase,
          active: item.active,
          store: {
            id: item.store?.id || "",
            name: item.store?.name || "",
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
  }, [currentPage, searchQuery]);

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
    fetchVouchers(1);
  }

  function resetFilter() {
    fetchVouchers(1);
    setCurrentPage(1);
    setStatusFilter("");
    setMemberFilter("");
    setJenisFilter("");
    setNilaiFilter("");
    setMinNilaiFilter("");
    setMaxNilaiFilter("");
    setTanggalMulaiFilter("");
    setTanggalBerakhirFilter("");
    setSortByFilter("");
    setSortDirectionFilter("");
    setShowFilter(false);
  }

  const formatDiscount = (discount: number | string): string => {
    const value = Number(discount);
    if (isNaN(value)) return "-";
    if (value >= 1000) return `Rp${value.toLocaleString("id-ID")}`;
    return `${value}%`;
  };

  const hasActiveFilters =
    statusFilter ||
    memberFilter ||
    jenisFilter ||
    nilaiFilter ||
    minNilaiFilter ||
    maxNilaiFilter ||
    tanggalMulaiFilter ||
    tanggalBerakhirFilter ||
    sortByFilter ||
    sortDirectionFilter;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Pengelolaan Diskon Produk"
        desc="Tampilan daftar diskon produk yang sedang aktif"
      />

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
            <div className="relative">
              <Filter onClick={() => setShowFilter(true)} />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <AddButton to="/discounts/create">Buat Diskon</AddButton>
          </div>
        </div>
        {error && <p className="text-red-600">{error}</p>}

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Diskon</th>
                <th className="px-6 py-4 font-medium">Nilai</th>
                <th className="px-6 py-4 font-medium text-center">Waktu</th>
                <th className="px-6 py-4 font-medium text-center">
                  Diskon Untuk
                </th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7}>
                    <LoadingColumn column={3} />
                  </td>
                </tr>
              )}
              {!loading && vouchers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
              {!loading && vouchers.length > 0 && (
                <>
                  {vouchers.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{item.name || "-"}</td>
                      <td className="px-6 py-4 font-semibold">
                        {formatDiscount(item.percentage ?? item.nominal)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {`${item.start_date} - ${item.end_date}`}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.is_member ? (
                          <span className="text-yellow-600 font-semibold bg-yellow-50 py-1 border border-yellow-500 px-5 rounded-lg">
                            Member
                          </span>
                        ) : (
                          <span className="text-blue-600 font-semibold bg-blue-50 py-1 border border-blue-500 px-5 rounded-lg">
                            Umum
                          </span>
                        )}
                      </td>
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
                            className="text-white hover:bg-yellow-600"
                          />
                          <DeleteIcon onClick={() => deleteVoucher(item.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalItems={totalItems}
          itemsPerPage={perPage}
          showInfo={true}
        />
      </div>

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        jenisFilter={jenisFilter}
        setJenisFilter={setJenisFilter}
        memberFilter={memberFilter}
        setMemberFilter={setMemberFilter}
        nilaiFilter={nilaiFilter}
        setNilaiFilter={setNilaiFilter}
        minNilaiFilter={minNilaiFilter}
        setMinNilaiFilter={setMinNilaiFilter}
        maxNilaiFilter={maxNilaiFilter}
        setMaxNilaiFilter={setMaxNilaiFilter}
        tanggalMulaiFilter={tanggalMulaiFilter}
        setTanggalMulaiFilter={setTanggalMulaiFilter}
        tanggalBerakhirFilter={tanggalBerakhirFilter}
        setTanggalBerakhirFilter={setTanggalBerakhirFilter}
        sortByFilter={sortByFilter}
        setSortByFilter={setSortByFilter}
        sortDirectionFilter={sortDirectionFilter}
        setSortDirectionFilter={setSortDirectionFilter}
        onApplyFilter={applyFilter}
        onResetFilter={resetFilter}
        statusOptions={statusOptions}
      />
    </div>
  );
}
