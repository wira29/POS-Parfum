import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { Clock, X, Calendar } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { FormatTime } from "@/core/helpers/FormatTime";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface Shift {
  user: string;
  image: string;
  time: string | null;
  date: string;
  start_price: number;
  end_price: number;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Shift[];
  code: number;
  pagination: Pagination;
}

interface FormattedDateTime {
  time: string;
  date: string;
}

interface FilterParams {
  from_date: string;
  until_date: string;
}

const MAX_PAGES_TO_SHOW = 5;

const ShiftIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<Shift[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 0,
  });
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    from_date: "",
    until_date: "",
  });
  const [tempFilterParams, setTempFilterParams] = useState<FilterParams>({
    from_date: "",
    until_date: "",
  });
  const apiClient = useApiClient();

  const fetchData = async (
    page: number = 1,
    filters?: FilterParams
  ): Promise<void> => {
    try {
      let url = `/shifts?page=${page}`;

      if (filters?.from_date && filters?.until_date) {
        url += `&from_date=${filters.from_date}&until_date=${filters.until_date}`;
      }

      const response = await apiClient.get<ApiResponse>(url);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchData(page, filterParams);
    }
  };

  const formatDateTime = (dateTime: string): FormattedDateTime => {
    const dateObj = new Date(dateTime);
    return {
      time: dateObj.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      date: dateObj.toLocaleDateString("id-ID"),
    };
  };

  const filteredData: Shift[] = data.filter((item) =>
    item.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPageNumbers = (): JSX.Element[] => {
    const { current_page, last_page } = pagination;
    const pages: JSX.Element[] = [];
    const startPage = Math.max(
      1,
      current_page - Math.floor(MAX_PAGES_TO_SHOW / 2)
    );
    const endPage = Math.min(last_page, startPage + MAX_PAGES_TO_SHOW - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded ${
            i === current_page
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleFilterClick = (): void => {
    setTempFilterParams(filterParams);
    setShowFilterModal(true);
  };

  const handleFilterApply = (): void => {
    setFilterParams(tempFilterParams);
    setShowFilterModal(false);
    fetchData(1, tempFilterParams);
  };

  const handleFilterReset = (): void => {
    setTempFilterParams({
      from_date: "",
      until_date: "",
    });

    fetchData();
    setShowFilterModal(false);
  };

  const handleFilterCancel = (): void => {
    setTempFilterParams(filterParams);
    setShowFilterModal(false);
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const formatDateForApi = (dateString: string): string => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const hasActiveFilters =
    tempFilterParams.from_date || tempFilterParams.until_date;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Shift Kasir"
        desc="Riwayat shift dan transaksi kasir."
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-5 items-center">
            <div className="w-80">
              <SearchInput
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
            <div
              onClick={handleFilterClick}
              className="cursor-pointer relative"
            >
              <Filter />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Uang Keluar
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Uang Masuk
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const { time, date } = formatDateTime(item.date);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img src={ImageHelper(item.image)} alt={item.user} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <Clock size={16} /> {time}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {FormatTime(date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      <span className="inline-flex items-center gap-1">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          <polygon
                            points="10,7 15,13 5,13"
                            fill="red"
                            style={{
                              transformOrigin: "50% 60%",
                              transition: "transform 0.2s",
                            }}
                            className="cursor-pointer"
                          />
                        </svg>
                        Rp {item.start_price.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      <span className="inline-flex items-center gap-1">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          <polygon
                            points="10,7 15,13 5,13"
                            fill="green"
                            style={{
                              transform: "rotate(180deg)",
                              transformOrigin: "50% 60%",
                              transition: "transform 0.2s",
                            }}
                            className="cursor-pointer"
                          />
                        </svg>
                        Rp {item.end_price.toLocaleString("id-ID")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {pagination.from}–{pagination.to} dari{" "}
              {pagination.total} data
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Data
                </h3>
                <button
                  onClick={handleFilterCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dari Tanggal
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formatDateForInput(tempFilterParams.from_date)}
                      onChange={(e) =>
                        setTempFilterParams({
                          ...tempFilterParams,
                          from_date: formatDateForApi(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM-DD-YY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hingga Tanggal
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formatDateForInput(tempFilterParams.until_date)}
                      onChange={(e) =>
                        setTempFilterParams({
                          ...tempFilterParams,
                          until_date: formatDateForApi(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM-DD-YY"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={handleFilterReset}
                className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleFilterCancel}
                  className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleFilterApply}
                  className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftIndex;
