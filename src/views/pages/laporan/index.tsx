import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";

export default function ProfitLossReportPage() {
  const [reportType, setReportType] = useState("Bulanan");
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2025");

  const reportData = {
    pendapatan: [
      { item: "Penghasilan Semua Produk", amount: "Rp 1.000.000" }
    ],
    pengeluaran: [
      { item: "Pengeluaran Semua Produk", amount: "Rp 5.000.000" }
    ],
    labaRugi: "Rp -3.000.000"
  };

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = ["2023", "2024", "2025"];
  const reportTypes = ["Bulanan", "Tahunan", "Harian"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb 
        title="Laporan Laba Rugi" 
        desc="Laporan laba rugi dari pembelian dan penjualan."
      />

      {/* Filter Card Pertama - Tipe Laporan */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Laporan
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {reportTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Bulan dan Tahun dalam satu baris */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>



      <div className="bg-gray rounded-lg shadow-sm border border-gray-200 p-6 mb-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Laporan</h3>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors"
          >
            <FiPrinter size={16} />
            Cetak Laporan
          </button>
        </div>
      </div>



      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-0">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Laporan Laba Rugi Retail Mandalika
          </h2>
          <p className="text-sm text-gray-600">
            Periode {selectedMonth} {selectedYear}
          </p>
        </div>



        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {/* Pendapatan Section Header */}
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 bg-gray-100 border-b border-gray-200">
                  Pendapatan
                </td>
                <td className="px-4 py-3 bg-gray-100 border-b border-gray-200"></td>
              </tr>
              {/* Pendapatan Items */}
              {reportData.pendapatan.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-600 bg-white border-b border-gray-200">
                    {item.item}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right bg-white border-b border-gray-200">
                    {item.amount}
                  </td>
                </tr>
              ))}

              {/* Pengeluaran Section Header */}
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 bg-gray-100 border-b border-gray-200">
                  Pengeluaran
                </td>
                <td className="px-4 py-3 bg-gray-100 border-b border-gray-200"></td>
              </tr>
              {/* Pengeluaran Items */}
              {reportData.pengeluaran.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-600 bg-white border-b border-gray-200">
                    {item.item}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right bg-white border-b border-gray-200">
                    {item.amount}
                  </td>
                </tr>
              ))}

              {/* Laba Rugi Section */}
              <tr>
                <td className="px-4 py-4 font-semibold text-gray-900 bg-gray-100 border-b border-gray-200">
                  Laba Rugi
                </td>
                <td className="px-4 py-4 font-semibold text-right text-gray-900 bg-gray-100 border-b border-gray-200">
                  {reportData.labaRugi}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}