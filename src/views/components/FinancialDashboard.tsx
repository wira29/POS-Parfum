import { TrendingUp } from "lucide-react";
import ReactApexChart from "react-apexcharts";

const FinancialDashboard = () => {
  const categories = ["12 Jun", "13 Jun", "14 Jun", "15 Jun"];

  const transactionHistory = [
    {
      date: "12-03-2025",
      type: "Pengeluaran",
      category: "Membeli Alkohol",
      amount: -300000,
      color: "text-red-500",
    },
    {
      date: "12-03-2025",
      type: "Pemasukan",
      category: "Membeli Alkohol",
      amount: 3000000,
      color: "text-green-500",
    },
    {
      date: "12-03-2025",
      type: "Pengeluaran",
      category: "Membeli Alkohol",
      amount: -300000,
      color: "text-red-500",
    },
    {
      date: "12-03-2025",
      type: "Pemasukan",
      category: "Membeli Alkohol",
      amount: 3000000,
      color: "text-green-500",
    },
    {
      date: "12-03-2025",
      type: "Pengeluaran",
      category: "Membeli Alkohol",
      amount: -300000,
      color: "text-red-500",
    },
    {
      date: "12-03-2025",
      type: "Pemasukan",
      category: "Membeli Alkohol",
      amount: 3000000,
      color: "text-green-500",
    },
    {
      date: "12-03-2025",
      type: "Pengeluaran",
      category: "Membeli Alkohol",
      amount: -300000,
      color: "text-red-500",
    },
  ];

  const formatCurrency = (amount: number) => {
    return `Rp ${Math.abs(amount).toLocaleString("id-ID")}`;
  };

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false },
    },
    colors: ["#22c55e", "#ef4444"],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "90%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories,
      labels: {
        formatter: (value) =>
          `Rp ${parseInt(value.toString(), 10).toLocaleString("id-ID")}`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
  };

  const ChartSeries = [
    {
      name: "Uang masuk",
      data: [50000, 20000, 40000, 90000],
    },
    {
      name: "Uang Keluar",
      data: [40000, 50000, 51000, 80000],
    },
  ];

  return (
    <div className="mt-5 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              History Pendapatan & Pengeluaran
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {transactionHistory.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {transaction.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-sm text-gray-600">
                      {transaction.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${transaction.color}`}>
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
              <h1 className="text-slate-800 font-normal">7 Hari Terakhir</h1>
              <button className="text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-700 transition-colors">
                Semua Transaksi →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profit</span>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1 bg-green-50 rounded-lg px-4 py-1.5">
                  <TrendingUp className="w-3 h-3" />
                  Profit naik 60%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                Rp 500,000
              </div>
              <hr className="border border-slate-300 my-2" />

              <div className="flex gap-10">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total uang masuk
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    Rp 2,500,000
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total uang keluar
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    Rp 2,000,000
                  </div>
                </div>
              </div>

              <div>
                <ReactApexChart options={chartOptions} series={ChartSeries} type="bar" height={250} />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">4 Hari Terakhir</span>
                <button className="text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-700 transition-colors">
                  Semua Transaksi →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
