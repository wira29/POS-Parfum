import React, { useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Printer } from "lucide-react";
import { LoadingCards } from "@/views/components/Loading";

const STYLE_INPUT =
  "w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-200";

interface LabaRugiData {
  pendapatan: {
    penghasilan_semua_produk: number;
  };
  pengeluaran: {
    pengeluaran_semua_produk: number;
  };
  laba_rugi: number;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: LabaRugiData;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatPeriode = (
  type: "month" | "year",
  month?: string,
  year?: string
): string => {
  if (type === "month" && month) {
    const date = new Date(month);
    return date.toLocaleDateString("id-ID", { year: "numeric", month: "long" });
  } else if (type === "year" && year) {
    return year;
  }
  return "";
};

export const LabaRugiIndex: React.FC = () => {
  const [selectType, setSelectType] = useState<"month" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [reportData, setReportData] = useState<LabaRugiData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);
  const isButtonDisabled =
    selectType === "month" ? !selectedMonth : !selectedYear;

  const getDummyData = (): LabaRugiData => ({
    pendapatan: { penghasilan_semua_produk: 15000000 },
    pengeluaran: { pengeluaran_semua_produk: 8500000 },
    laba_rugi: 6500000,
  });

  const fetchReportData = async (): Promise<ApiResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Data berhasil diambil",
          data: getDummyData(),
        });
      }, 1000);
    });
  };

  const handleCheckReport = async () => {
    if (selectType === "month" && !selectedMonth) return;
    if (selectType === "year" && !selectedYear) return;

    setIsLoading(true);
    try {
      const response = await fetchReportData();
      if (response.status) {
        setReportData(response.data);
        setShowReport(true);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetReport = () => {
    setShowReport(false);
    setReportData(null);
    setSelectedMonth("");
    setSelectedYear("");
  };

  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb
        title="Laporan Laba Rugi"
        desc="Laporan laba rugi dari pembelian dan penjualan."
      />
      <div className="bg-white rounded-xl shadow w-full p-4 sm:p-6 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-4 sm:gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Tipe Laporan
            </label>
            <select
              name="type"
              id="type"
              value={selectType}
              onChange={(e) =>
                setSelectType(e.target.value as "month" | "year")
              }
              className={STYLE_INPUT}
            >
              <option value="month">Bulanan</option>
              <option value="year">Tahunan</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            {selectType === "month" ? (
              <>
                <label htmlFor="month" className="text-sm font-medium">
                  Bulan
                </label>
                <input
                  type="month"
                  name="month"
                  className={STYLE_INPUT}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </>
            ) : (
              <>
                <label htmlFor="yearSelect" className="text-sm font-medium">
                  Tahun
                </label>
                <select
                  name="year"
                  id="yearSelect"
                  className={STYLE_INPUT}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Pilih Tahun</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="mt-6 sm:mt-8 flex gap-5">
              <button
                type="button"
                onClick={handleCheckReport}
                disabled={isButtonDisabled || isLoading}
                className={`w-full rounded-lg px-4 py-2.5 cursor-pointer text-white text-sm font-medium transition-colors duration-200 ${
                  isButtonDisabled || isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Memuat..." : "Periksa Laporan"}
              </button>
              <button
                type="button"
                onClick={resetReport}
                className={`w-full rounded-lg px-4 py-2.5 cursor-pointer text-white text-sm font-medium transition-colors duration-200 ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingCards />
      ) : (
        showReport &&
        reportData && (
          <div className="rounded-xl w-full p-4 sm:p-6 mt-6">
            <div className="bg-indigo-100 px-6 rounded-t-xl py-5 flex justify-between items-center">
              <h1 className="text-2xl font-semibold hidden lg:block">
                Laporan
              </h1>
              <button
                disabled={isButtonDisabled || isLoading}
                className={`flex gap-2 text-center cursor-pointer rounded-lg px-4 py-2 text-white text-sm font-medium transition-colors duration-200 ${
                  isButtonDisabled || isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <Printer /> Cetak Laporan
              </button>
            </div>
            <div className="bg-white py-5 px-5 rounded-b-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1 mt-5">
                  <h2 className="lg:text-2xl text-xl font-semibold text-gray-800">
                    Laporan Laba Rugi Retail Mandalika
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Periode{" "}
                    {formatPeriode(selectType, selectedMonth, selectedYear)}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto border border-gray-300 rounded-lg">
                <table className="w-full">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td className="px-6 py-4 text-base font-semibold text-gray-900 border-r border-gray-300">
                        Pendapatan
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 text-base text-gray-600 pl-12 border-r border-gray-300">
                        Penghasilan Semua Produk
                      </td>
                      <td className="px-6 py-4 text-base text-gray-700 text-right font-medium">
                        {formatCurrency(
                          reportData.pendapatan.penghasilan_semua_produk
                        )}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-6 py-4 text-base font-semibold text-gray-900 border-r w-1/2 border-gray-300">
                        Pengeluaran
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 text-base text-gray-600 pl-12 border-r border-gray-300">
                        Pengeluaran Semua Produk
                      </td>
                      <td className="px-6 py-4 text-base text-gray-700 text-right font-medium">
                        {formatCurrency(
                          reportData.pengeluaran.pengeluaran_semua_produk
                        )}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-6 py-4 text-base font-semibold text-gray-900 border-r border-gray-300">
                        Laba Rugi
                      </td>
                      <td className="px-6 py-4 text-base font-semibold text-right">
                        <span
                          className={
                            reportData.laba_rugi >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatCurrency(reportData.laba_rugi)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
