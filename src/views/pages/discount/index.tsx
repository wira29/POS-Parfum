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

const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder,
  label
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueOptions = [...new Set(filteredOptions)];

  return (
    <div className="relative">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          placeholder={placeholder}
          value={value}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
        />
        <div 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="py-1">
            <div
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearchTerm("");
              }}
            >
              Semua
            </div>
            {uniqueOptions.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterModal = ({
  open,
  onClose,
  namaDiskonFilter,
  setNamaDiskonFilter,
  namaVariantFilter,
  setNamaVariantFilter,
  statusFilter,
  setStatusFilter,
  jenisFilter,
  setJenisFilter,
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
  namaDiskonOptions,
  namaVariantOptions,
  statusOptions,
}: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="font-semibold text-xl mb-6 text-gray-800">Filter Data</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <SearchableSelect
              value={namaDiskonFilter}
              onChange={setNamaDiskonFilter}
              options={namaDiskonOptions}
              placeholder="Ketik atau pilih..."
              label="Nama Diskon"
            />

            <SearchableSelect
              value={namaVariantFilter}
              onChange={setNamaVariantFilter}
              options={namaVariantOptions}
              placeholder="Ketik atau pilih..."
              label="Nama Produk Varian"
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                {statusOptions.map((status: any, index: number) => (
                  <option key={index} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Jenis</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
              >
                <option value="">Semua Jenis</option>
                <option value="percent">Persen (%)</option>
                <option value="fixed">Nominal (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nilai</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ketikkan jumlah"
                value={nilaiFilter}
                onChange={(e) => setNilaiFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Minimum Nilai Diskon</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ketikkan jumlah"
                value={minNilaiFilter}
                onChange={(e) => setMinNilaiFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Maximum Nilai Diskon</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ketikkan jumlah"
                value={maxNilaiFilter}
                onChange={(e) => setMaxNilaiFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={tanggalMulaiFilter}
                onChange={(e) => setTanggalMulaiFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal Berakhir</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={tanggalBerakhirFilter}
                onChange={(e) => setTanggalBerakhirFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onResetFilter}
          >
            Reset
          </button>
          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
  expired: string | null;
  min: number;
  max_used: number;
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
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const [showFilter, setShowFilter] = useState(false);
  const [namaDiskonFilter, setNamaDiskonFilter] = useState("");
  const [namaVariantFilter, setNamaVariantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [nilaiFilter, setNilaiFilter] = useState("");
  const [minNilaiFilter, setMinNilaiFilter] = useState("");
  const [maxNilaiFilter, setMaxNilaiFilter] = useState("");
  const [tanggalMulaiFilter, setTanggalMulaiFilter] = useState("");
  const [tanggalBerakhirFilter, setTanggalBerakhirFilter] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [namaDiskonOptions, setNamaDiskonOptions] = useState<string[]>([]);
  const [namaVariantOptions, setNamaVariantOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  async function fetchAllVouchers() {
    try {
      const response = await ApiClient.get('/discount-vouchers?per_page=1000');
      if (response.data.success) {
        const apiData = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          expired: item.expired,
          min: item.min,
          max_used: item.max_used,
          variant_name: item.details?.variant_name || '',
          code_product: item.code_product,
          discount: item.discount,
          category: item.type,
          used: item.used,
          active: item.active,
          store: {
            id: item.store?.id || '',
            name: item.store?.name || '',
          },
        }));

        setAllVouchers(apiData);
        
        const uniqueNames = [...new Set(apiData.map((v: Voucher) => v.name).filter(Boolean))];
        const uniqueVariants = [...new Set(apiData.map((v: Voucher) => v.variant_name).filter(Boolean))];
        const uniqueStatuses = [...new Set(apiData.map((v: Voucher) => ({
          value: v.active.toString(),
          label: v.active === 1 ? 'Aktif' : 'Tidak Aktif'
        })).map(s => JSON.stringify(s)))].map(s => JSON.parse(s));

        setNamaDiskonOptions(uniqueNames);
        setNamaVariantOptions(uniqueVariants);
        setStatusOptions(uniqueStatuses);
      }
    } catch (error) {
      console.error("Error fetching all vouchers:", error);
    }
  }

  async function fetchVouchers(page = 1) {
    setLoading(true);
    setError(null);
    try {
      let url = `/discount-vouchers?per_page=${perPage}&page=${page}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (namaDiskonFilter) {
        url += `&name=${encodeURIComponent(namaDiskonFilter)}`;
      }
      if (namaVariantFilter) {
        url += `&variant=${encodeURIComponent(namaVariantFilter)}`;
      }
      if (statusFilter !== "") {
        url += `&active=${statusFilter}`;
      }
      if (jenisFilter) {
        url += `&type=${jenisFilter}`;
      }
      if (nilaiFilter) {
        url += `&discount=${nilaiFilter}`;
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

      const response = await ApiClient.get(url);
      if (response.data.success) {
        const apiData = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          expired: item.expired,
          min: item.min,
          max_used: item.max_used,
          variant_name: item.details?.variant_name || '',
          code_product: item.code_product,
          discount: item.discount,
          category: item.type,
          used: item.used,
          active: item.active,
          store: {
            id: item.store?.id || '',
            name: item.store?.name || '',
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
    fetchAllVouchers();
  }, []);

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
          fetchAllVouchers();
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
    setNamaDiskonFilter("");
    setNamaVariantFilter("");
    setStatusFilter("");
    setJenisFilter("");
    setNilaiFilter("");
    setMinNilaiFilter("");
    setMaxNilaiFilter("");
    setTanggalMulaiFilter("");
    setTanggalBerakhirFilter("");
    setCurrentPage(1);
    setShowFilter(false);
    fetchVouchers(1);
  }

  const formatDiscount = (discount: number | string): string => {
    const value = Number(discount);
    if (isNaN(value)) return "-";
    if (value >= 1000) return `Rp${value.toLocaleString("id-ID")}`;
    return `${value}%`;
  };

  const hasActiveFilters = namaDiskonFilter || namaVariantFilter || statusFilter || jenisFilter || 
                          nilaiFilter || minNilaiFilter || maxNilaiFilter || tanggalMulaiFilter || tanggalBerakhirFilter;

  const getActiveFiltersText = () => {
    const filters = [];
    if (namaDiskonFilter) filters.push(`Nama: ${namaDiskonFilter}`);
    if (namaVariantFilter) filters.push(`Varian: ${namaVariantFilter}`);
    if (statusFilter) filters.push(`Status: ${statusOptions.find(s => s.value === statusFilter)?.label || statusFilter}`);
    if (jenisFilter) filters.push(`Jenis: ${jenisFilter === 'percent' ? 'Persen (%)' : 'Nominal (Rp)'}`);
    if (nilaiFilter) filters.push(`Nilai: ${nilaiFilter}`);
    if (minNilaiFilter) filters.push(`Min: ${minNilaiFilter}`);
    if (maxNilaiFilter) filters.push(`Max: ${maxNilaiFilter}`);
    if (tanggalMulaiFilter) filters.push(`Mulai: ${tanggalMulaiFilter}`);
    if (tanggalBerakhirFilter) filters.push(`Berakhir: ${tanggalBerakhirFilter}`);
    return filters.join(', ');
  };

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
                    colSpan={7}
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
                  <td className="px-6 py-4">{item.name || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <h1 className="font-semibold">
                        {item.variant_name || "-"}
                      </h1>
                      <h1>{item.code_product || "-"}</h1>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.category || "-"}</td>
                  <td className="px-6 py-4">{formatDiscount(item.discount)}</td>
                  <td className="px-6 py-4">
                    {item.expired === null ? "-" : item.expired}
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
              {loading && <tr>
                <td  className="px-6 py-4 text-center text-gray-500" colSpan={7}>Loading...</td>
                </tr>}
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
        namaDiskonFilter={namaDiskonFilter}
        setNamaDiskonFilter={setNamaDiskonFilter}
        namaVariantFilter={namaVariantFilter}
        setNamaVariantFilter={setNamaVariantFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        jenisFilter={jenisFilter}
        setJenisFilter={setJenisFilter}
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
        onApplyFilter={applyFilter}
        onResetFilter={resetFilter}
        namaDiskonOptions={namaDiskonOptions}
        namaVariantOptions={namaVariantOptions}
        statusOptions={statusOptions}
      />
    </div>
  );
}