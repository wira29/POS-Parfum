import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  SVChartSearch,
  SVGBankDown,
  SVGBankUp,
  SVGChart,
} from "@/views/components/svg/Svg";
import { DashboardCard } from "@/views/components/Card/DashboardCard";
import { TabNav } from "@/views/components/TabNav";
import FinancialDashboard from "@/views/components/FinancialDashboard";

export const DashboardOwner = () => {
  const [activeTab, setActiveTab] = useState("retail");
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("12");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab, selectedMonth]);

  const retailData = [
    { name: "Jan", value: 1800 },
    { name: "Feb", value: 1600 },
    { name: "Mar", value: 1200 },
    { name: "Apr", value: 1000 },
    { name: "May", value: 600 },
    { name: "Jun", value: 400 },
    { name: "Jul", value: 300 },
    { name: "Aug", value: 200 },
    { name: "Sep", value: 150 },
    { name: "Oct", value: 100 },
  ];

  const warehouseIncomeData = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (365 - i));
    return {
      x: date.getTime(),
      y: Math.floor(Math.random() * 100000000) + 5000000,
    };
  });

  const warehouseExpenseData = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (365 - i));
    return {
      x: date.getTime(),
      y: Math.floor(Math.random() * 1000) + 2000,
    };
  });

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: retailData.map((item) => item.name),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toString(),
      },
    },
    grid: {
      borderColor: "#D2D6E5",
      strokeDashArray: 3,
    },
  };

  const barChartSeries = [
    {
      name: "Transaksi",
      data: retailData.map((item) => item.value),
    },
  ];

  const areaChartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#3B82F6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "MMM",
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rp ${(val / 1000000).toFixed(0)}M`,
      },
    },
    grid: {
      borderColor: "#D2D6E5",
      strokeDashArray: 3,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (val) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
  };

  const warehouseIncomeSeries = [
    {
      name: "Pendapatan",
      data: warehouseIncomeData,
    },
  ];

  const warehouseExpenseOptions: ApexOptions = {
    ...areaChartOptions,
    colors: ["#EF4444"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
  };

  const warehouseExpenseSeries = [
    {
      name: "Pengeluaran",
      data: warehouseExpenseData,
    },
  ];

  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-[400px] rounded-lg w-full bg-black/20 animate-pulse flex justify-center"></div>
      );
    }

    switch (activeTab) {
      case "retail":
        return (
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        );
      case "warehouse-income":
        return (
          <ReactApexChart
            options={areaChartOptions}
            series={warehouseIncomeSeries}
            type="area"
            height={350}
          />
        );
      case "warehouse-expense":
        return (
          <ReactApexChart
            options={warehouseExpenseOptions}
            series={warehouseExpenseSeries}
            type="area"
            height={350}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            icon={<SVGChart />}
            title="Stok Warehouse"
            value="Warehouse Satu"
            footerLeft={
              <>
                <ArrowDown className="text-red-500 font-bold" />
                <span className="text-red-500 font-semibold text-sm">
                  20 <span className="text-sm">pcs</span>
                </span>
              </>
            }
            footerRight="Update 20 Juni 2025"
          />

          <DashboardCard
            icon={<SVChartSearch />}
            title="Transaksi Retail"
            value="Retail DuaBelas"
            footerLeft={
              <>
                <ArrowUp className="text-green-500 font-bold" />
                <span className="text-green-500 font-semibold text-sm">
                  1200 <span className="text-sm">Transaksi</span>
                </span>
              </>
            }
          />

          <DashboardCard
            icon={<SVGBankUp />}
            title="Pendapatan Warehouse"
            value="Rp 20.000.000"
            footerLeft={<ArrowUp className="text-green-500 font-bold" />}
            footerRight="Update 20 Juni 2025"
          />

          <DashboardCard
            icon={<SVGBankDown />}
            title="Pengeluaran Warehouse"
            value="Rp 500.000"
            footerLeft={<ArrowDown className="text-red-500 font-bold" />}
            footerRight="Update 20 Juni 2025"
          />
        </div>

        <div className="xl:col-span-full">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {
                      {
                        retail: "Transaksi Retail",
                        "warehouse-income": "Pendapatan Warehouse",
                        "warehouse-expense": "Pengeluaran Warehouse",
                      }[activeTab]
                    }
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {
                      {
                        retail: "Data transaksi ritel dalam periode waktu",
                        "warehouse-income":
                          "Pendapatan Warehouse Selama 1 Tahun Terakhir",
                        "warehouse-expense":
                          "Pengeluaran Warehouse Selama 1 Tahun Terakhir",
                      }[activeTab]
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {["1", "5", "12"].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedMonth(val)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        selectedMonth === val
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:text-gray-900 border border-gray-300"
                      }`}
                    >
                      {val === "1"
                        ? "1 Bulan"
                        : val === "5"
                        ? "5 Bulan"
                        : "1 Tahun"}
                    </button>
                  ))}
                </div>
              </div>
              <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="p-6">{renderChart()}</div>
          </div>
        </div>
        <FinancialDashboard />
      </div>
    </div>
  );
};
