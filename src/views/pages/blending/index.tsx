import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Pagination } from "@/views/components/Pagination";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import ViewIcon from "@/views/components/ViewIcon";
import { X } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { LoadingColumn } from "@/views/components/Loading";

interface BlendingProduct {
  id: number;
  nama: string;
  tanggalPembuatan: string;
  kategori: string;
  stok: string;
  hargaNormal: string;
  hargaDiskon: string;
  status: string;
  products: {
    nama: string;
    harga: string;
    gambar: string;
    variants: { nama: string; harga: string }[];
  }[];
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  quantityFrom: string;
  quantityTo: string;
}

export default function BlendingIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const ApiClient = useApiClient();
  const [blendingData, setBlendingData] = useState<BlendingProduct[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"date" | "quantity">("date");
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    quantityFrom: "",
    quantityTo: "",
  });
  const [tempFilters, setTempFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    quantityFrom: "",
    quantityTo: "",
  });

  const getData = async () => {
  try {
    setLoading(true);
    const response = await ApiClient.get(
      `/product-blend?page=${currentPage}&per_page=${itemsPerPage}`
    );

    const apiData = response.data.data ?? [];
    // console.log(apiData);
    
    const meta = response.data.pagination;

    const transformed: BlendingProduct[] = apiData.map((item: any) => ({
      id: item.id,
      nama: item.product?.blend_name || "Tanpa Nama",
      tanggalPembuatan: item.date || "",
      kategori: "-",
      stok: item.quantity ? `${item.quantity}G` : "-",
      hargaNormal: "-",
      hargaDiskon: "-",
      status: "-",
      products:
        item.product_blend_details?.map((detail: any) => ({
          nama: detail.product_detail?.product?.name ?? "Produk Tanpa Nama",
          harga: "-",
          gambar: "/img/default.png",
          variants: [],
        })) ?? [],
    }));
    setBlendingData(transformed);
    setTotalData(meta.total);
  } catch (error) {
    console.error("Error fetching data:", error);
    setBlendingData([]);
    setTotalData(0);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  getData();
}, [currentPage]);


const paginatedData = blendingData;
const totalPages = Math.ceil(totalData / itemsPerPage);


  const handleFilterOpen = () => {
    setTempFilters({ ...filters });
    setShowFilter(true);
  };

  const handleFilterApply = () => {
    setFilters({ ...tempFilters });
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      dateFrom: "",
      dateTo: "",
      quantityFrom: "",
      quantityTo: "",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setShowFilter(false);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Pembuatan Blending Produk"
        desc="Tampilan daftar blending produk yang sedang aktif"
      />
      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Filter onClick={handleFilterOpen} />
          </div>
          <div className="w-full sm:w-auto">
            <AddButton to="/blendings/create">Tambah Blending</AddButton>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Blending</th>
                <th className="px-6 py-4 font-medium">Tanggal Pembuatan</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-4" colSpan={4}>
                      <LoadingColumn column={4}/>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-black text-base font-semibold">
                        {item.nama}
                      </span>
                      <br /> Terdiri dari {item.products.length} Product
                    </td>
                    <td className="px-6 py-4">
                      {item.tanggalPembuatan
                        ? new Date(item.tanggalPembuatan).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{item.stok}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <ViewIcon to={`/blendings/${item.id}/detail`} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
          <span className="text-gray-700">{totalData} Data</span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {showFilter && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFilter(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Filter</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("date")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer transition-colors ${
                    activeTab === "date"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  Tanggal Pembuatan
                </button>
                <button
                  onClick={() => setActiveTab("quantity")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer transition-colors ml-8 ${
                    activeTab === "quantity"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  Quantity
                </button>
              </div>

              {activeTab === "date" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={tempFilters.dateFrom}
                          onChange={(e) =>
                            setTempFilters({
                              ...tempFilters,
                              dateFrom: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={tempFilters.dateTo}
                          onChange={(e) =>
                            setTempFilters({
                              ...tempFilters,
                              dateTo: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "quantity" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <input
                        type="number"
                        placeholder="From"
                        value={tempFilters.quantityFrom}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            quantityFrom: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <input
                        type="number"
                        placeholder="To"
                        value={tempFilters.quantityTo}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            quantityTo: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-start gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleFilterApply}
                className="px-6 py-2 cursor-pointer text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Terapkan
              </button>
              <button
                onClick={handleFilterReset}
                className="px-6 py-2 cursor-pointer text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
