import { Breadcrumb } from "@/views/components/Breadcrumb";
import Card from "@/views/components/Card/Card";
import { SearchInput } from "@/views/components/SearchInput";
import { useState, useRef } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface SalesData {
  id: string;
  produk: string;
  namaPembeli: string;
  estimasi: string;
  quantity: string;
  total: string;
  status: "Berhasil" | "Gagal";
}

interface FilterState {
  status: string;
  produk: string;
  namaPembeli: string;
  minHarga: string;
  maxHarga: string;
  startDate: string;
  endDate: string;
  minQuantity: string;
  maxQuantity: string;
}

export const RiwayatPenjualan: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [tempFilters, setTempFilters] = useState<FilterState>({
    status: "",
    produk: "",
    namaPembeli: "",
    minHarga: "",
    maxHarga: "",
    startDate: "",
    endDate: "",
    minQuantity: "",
    maxQuantity: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    status: "",
    produk: "",
    namaPembeli: "",
    minHarga: "",
    maxHarga: "",
    startDate: "",
    endDate: "",
    minQuantity: "",
    maxQuantity: "",
  });

  const data: SalesData[] = [
    {
      id: "#12345",
      produk: "Parfum Siang",
      namaPembeli: "Ahmad Sutrisno",
      estimasi: "13-Mei-2025",
      quantity: "5.000G",
      total: "Rp 5.000.000",
      status: "Berhasil",
    },
    {
      id: "#12346",
      produk: "Parfum Malam",
      namaPembeli: "Sari Wulandari",
      estimasi: "14-Mei-2025",
      quantity: "3.000G",
      total: "Rp 3.000.000",
      status: "Gagal",
    },
    {
      id: "#12347",
      produk: "Parfum Rose",
      namaPembeli: "Budi Santoso",
      estimasi: "15-Mei-2025",
      quantity: "2.500G",
      total: "Rp 2.750.000",
      status: "Berhasil",
    },
    {
      id: "#12348",
      produk: "Parfum Lavender",
      namaPembeli: "Dewi Kartika",
      estimasi: "16-Mei-2025",
      quantity: "4.200G",
      total: "Rp 4.620.000",
      status: "Berhasil",
    },
    {
      id: "#12349",
      produk: "Parfum Citrus",
      namaPembeli: "Andi Pratama",
      estimasi: "17-Mei-2025",
      quantity: "1.800G",
      total: "Rp 1.980.000",
      status: "Gagal",
    },
    {
      id: "#12350",
      produk: "Parfum Vanilla",
      namaPembeli: "Maya Sari",
      estimasi: "18-Mei-2025",
      quantity: "3.600G",
      total: "Rp 3.960.000",
      status: "Berhasil",
    },
    {
      id: "#12351",
      produk: "Parfum Jasmine",
      namaPembeli: "Riko Handoko",
      estimasi: "19-Mei-2025",
      quantity: "2.100G",
      total: "Rp 2.310.000",
      status: "Berhasil",
    },
    {
      id: "#12352",
      produk: "Parfum Mint",
      namaPembeli: "Lina Permata",
      estimasi: "20-Mei-2025",
      quantity: "2.800G",
      total: "Rp 3.080.000",
      status: "Gagal",
    },
    {
      id: "#12353",
      produk: "Parfum Ocean",
      namaPembeli: "Fajar Nugroho",
      estimasi: "21-Mei-2025",
      quantity: "4.500G",
      total: "Rp 4.950.000",
      status: "Berhasil",
    },
    {
      id: "#12354",
      produk: "Parfum Wood",
      namaPembeli: "Indira Sari",
      estimasi: "22-Mei-2025",
      quantity: "3.300G",
      total: "Rp 3.630.000",
      status: "Berhasil",
    },
    {
      id: "#12355",
      produk: "Parfum Floral",
      namaPembeli: "Hendra Wijaya",
      estimasi: "23-Mei-2025",
      quantity: "1.500G",
      total: "Rp 1.650.000",
      status: "Gagal",
    },
    {
      id: "#12356",
      produk: "Parfum Musk",
      namaPembeli: "Rina Maharani",
      estimasi: "24-Mei-2025",
      quantity: "4.000G",
      total: "Rp 4.400.000",
      status: "Berhasil",
    },
    {
      id: "#12357",
      produk: "Parfum Fresh",
      namaPembeli: "Arief Rahman",
      estimasi: "25-Mei-2025",
      quantity: "2.700G",
      total: "Rp 2.970.000",
      status: "Berhasil",
    },
    {
      id: "#12358",
      produk: "Parfum Amber",
      namaPembeli: "Siska Dewi",
      estimasi: "26-Mei-2025",
      quantity: "3.900G",
      total: "Rp 4.290.000",
      status: "Gagal",
    },
    {
      id: "#12359",
      produk: "Parfum Spice",
      namaPembeli: "Doni Setiawan",
      estimasi: "27-Mei-2025",
      quantity: "2.200G",
      total: "Rp 2.420.000",
      status: "Berhasil",
    },
    {
      id: "#12360",
      produk: "Parfum Berry",
      namaPembeli: "Yuni Astuti",
      estimasi: "28-Mei-2025",
      quantity: "3.700G",
      total: "Rp 4.070.000",
      status: "Berhasil",
    },
    {
      id: "#12361",
      produk: "Parfum Classic",
      namaPembeli: "Teguh Santoso",
      estimasi: "29-Mei-2025",
      quantity: "1.900G",
      total: "Rp 2.090.000",
      status: "Gagal",
    },
    {
      id: "#12362",
      produk: "Parfum Oriental",
      namaPembeli: "Fitri Handayani",
      estimasi: "30-Mei-2025",
      quantity: "4.100G",
      total: "Rp 4.510.000",
      status: "Berhasil",
    },
    {
      id: "#12363",
      produk: "Parfum Green",
      namaPembeli: "Wahyu Pratama",
      estimasi: "31-Mei-2025",
      quantity: "2.600G",
      total: "Rp 2.860.000",
      status: "Berhasil",
    },
    {
      id: "#12364",
      produk: "Parfum Premium",
      namaPembeli: "Nana Suryani",
      estimasi: "01-Jun-2025",
      quantity: "5.200G",
      total: "Rp 5.720.000",
      status: "Berhasil",
    },
  ];

  const perPage = 5;

  const applyFilters = (data: SalesData[]): SalesData[] => {
    return data.filter((item) => {
      const matchesSearch =
        !searchValue ||
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchValue.toLowerCase())
        );

      const matchesStatus =
        !appliedFilters.status || item.status === appliedFilters.status;
      const matchesProduk =
        !appliedFilters.produk ||
        item.produk.toLowerCase().includes(appliedFilters.produk.toLowerCase());
      const matchesNamaPembeli =
        !appliedFilters.namaPembeli ||
        item.namaPembeli
          .toLowerCase()
          .includes(appliedFilters.namaPembeli.toLowerCase());

      const itemQuantity = parseInt(item.quantity.replace(/[^\d]/g, ""));
      const minQuantity = appliedFilters.minQuantity
        ? parseInt(appliedFilters.minQuantity)
        : 0;
      const maxQuantity = appliedFilters.maxQuantity
        ? parseInt(appliedFilters.maxQuantity)
        : Infinity;
      const matchesQuantity =
        itemQuantity >= minQuantity && itemQuantity <= maxQuantity;

      const itemPrice = parseInt(item.total.replace(/[^\d]/g, ""));
      const minPrice = appliedFilters.minHarga
        ? parseInt(appliedFilters.minHarga)
        : 0;
      const maxPrice = appliedFilters.maxHarga
        ? parseInt(appliedFilters.maxHarga)
        : Infinity;
      const matchesPrice = itemPrice >= minPrice && itemPrice <= maxPrice;

      let matchesDate = true;
      if (appliedFilters.startDate || appliedFilters.endDate) {
        const itemDate = new Date(item.estimasi.split("-").reverse().join("-"));
        const startDate = appliedFilters.startDate
          ? new Date(appliedFilters.startDate)
          : new Date("1900-01-01");
        const endDate = appliedFilters.endDate
          ? new Date(appliedFilters.endDate)
          : new Date("2100-12-31");
        matchesDate = itemDate >= startDate && itemDate <= endDate;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProduk &&
        matchesNamaPembeli &&
        matchesQuantity &&
        matchesPrice &&
        matchesDate
      );
    });
  };

  const filteredData = applyFilters(data);
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getStatusStyle = (status: string): string => {
    return status === "Berhasil"
      ? "bg-green-50 text-green-500 border-green-200"
      : "bg-red-50 text-red-500 border-red-200";
  };

  const handleTempFilterChange = (
    field: keyof FilterState,
    value: string
  ): void => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = (): void => {
    const resetValues: FilterState = {
      status: "",
      produk: "",
      namaPembeli: "",
      minHarga: "",
      maxHarga: "",
      startDate: "",
      endDate: "",
      minQuantity: "",
      maxQuantity: "",
    };
    setTempFilters(resetValues);
    setAppliedFilters(resetValues);
  };

  const applyFilterAndClose = (): void => {
    setAppliedFilters(tempFilters);
    setIsOpen(false);
    setCurrentPage(1);
  };

  const handleShowDetail = (item: SalesData): void => {
    alert(
      `Detail Order:\nID: ${item.id}\nProduk: ${item.produk}\nNama Pembeli: ${item.namaPembeli}\nEstimasi: ${item.estimasi}\nQuantity: ${item.quantity}\nTotal: ${item.total}\nStatus: ${item.status}`
    );
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const cancelFilterAndClose = (): void => {
    setTempFilters(appliedFilters);
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      cancelFilterAndClose();
    }
  };

  const renderPagination = (): JSX.Element => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (totalPages <= 1) {
      return <></>;
    }

    return (
      <div className="flex items-center justify-between mt-6 px-4">
        <div className="text-sm text-gray-700">
          Menampilkan {(currentPage - 1) * perPage + 1} sampai{" "}
          {Math.min(currentPage * perPage, filteredData.length)} dari{" "}
          {filteredData.length} data
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Sebelumnya
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 py-2 text-sm text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 text-sm font-medium rounded-lg cursor-pointer ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 py-2 text-sm text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            }`}
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  const FilterModal: React.FC = () => (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">
                Filter Data
              </h3>
              <button
                onClick={cancelFilterAndClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-8 h-8 cursor-pointer" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pembeli
                </label>
                <input
                  type="text"
                  defaultValue={tempFilters.namaPembeli}
                  onBlur={(e) =>
                    handleTempFilterChange("namaPembeli", e.target.value)
                  }
                  ref={(el) => (inputRefs.current["namaPembeli"] = el)}
                  placeholder="Cari nama pembeli..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={tempFilters.status}
                    onChange={(e) =>
                      handleTempFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="Berhasil">Berhasil</option>
                    <option value="Gagal">Gagal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Produk
                  </label>
                  <input
                    type="text"
                    defaultValue={tempFilters.produk}
                    onBlur={(e) =>
                      handleTempFilterChange("produk", e.target.value)
                    }
                    ref={(el) => (inputRefs.current["produk"] = el)}
                    placeholder="Cari produk..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Minimum
                  </label>
                  <input
                    type="number"
                    defaultValue={tempFilters.minQuantity}
                    onBlur={(e) =>
                      handleTempFilterChange("minQuantity", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min quantity..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Maximum
                  </label>
                  <input
                    type="number"
                    defaultValue={tempFilters.maxQuantity}
                    onBlur={(e) =>
                      handleTempFilterChange("maxQuantity", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Max quantity..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Minimum
                  </label>
                  <input
                    type="number"
                    defaultValue={tempFilters.minHarga}
                    onBlur={(e) =>
                      handleTempFilterChange("minHarga", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min harga..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Maximum
                  </label>
                  <input
                    type="number"
                    defaultValue={tempFilters.maxHarga}
                    onBlur={(e) =>
                      handleTempFilterChange("maxHarga", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Max harga..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    defaultValue={tempFilters.startDate}
                    onBlur={(e) =>
                      handleTempFilterChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    defaultValue={tempFilters.endDate}
                    onBlur={(e) =>
                      handleTempFilterChange("endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={resetFilters}
                className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filter
              </button>
              <div className="flex gap-3">
                <button
                  onClick={cancelFilterAndClose}
                  className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={applyFilterAndClose}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="py-5 px-6 bg-gray-50 min-h-screen">
      <Breadcrumb title="Riwayat Penjualan" desc="Riwayat penjualan pusat" />

      <Card className="mt-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <SearchInput
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-200"
            >
              <SlidersHorizontal className="text-blue-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBFBFB]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  ID ORDER
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Produk
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Nama Pembeli
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Estimasi Tanggal
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Total Harga
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-gray-900">{item.id}</td>
                  <td className="py-4 px-4 text-gray-700">{item.produk}</td>
                  <td className="py-4 px-4 text-gray-700">
                    {item.namaPembeli}
                  </td>
                  <td className="py-4 px-4 text-gray-700">{item.estimasi}</td>
                  <td className="py-4 px-4 text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-4 text-gray-700">{item.total}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium border ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleShowDetail(item)}
                      className="flex items-center justify-center p-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </Card>

      <FilterModal />
    </div>
  );
};
