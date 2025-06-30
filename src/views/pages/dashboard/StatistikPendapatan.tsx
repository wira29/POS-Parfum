import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

const rupiah = (v: number) =>
  `Rp ${v.toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agst",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

interface ChartData {
  year: number;
  data: number[];
}

interface StatistikPendapatanProps {
  chartData: ChartData;
  selectedYear: number;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface StatistikPendapatanProps {
  chartData: ChartData;
}

const StatistikPendapatan: React.FC<StatistikPendapatanProps> = ({
  chartData,
  selectedYear,
  onYearChange,
}) => {
  const { series, options } = useMemo(() => {
    const data = chartData.data;
    const maxValue = Math.max(...data);
    const maxIndex = data.indexOf(maxValue);


    return {
      series: [{ name: "Jumlah", data }],
      options: {
        chart: {
          type: "area",
          toolbar: { show: false },
          zoom: { enabled: false },
          foreColor: "#64748b",
        },
        stroke: {
          curve: "smooth",
          width: 4,
          colors: ["#1967ff"],
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.2,
            opacityTo: 0,
            stops: [0, 100],
            colorStops: [{ offset: 0, color: "#1967ff", opacity: 1 }],
          },
        },
        markers: {
          size: 6,
          strokeWidth: 0,
          colors: ["#111"],
          discrete:
            !data || data.length === 0
              ? []
              : [
                  { seriesIndex: 0, dataPointIndex: 0, fillColor: "#111" },
                  {
                    seriesIndex: 0,
                    dataPointIndex: data.length - 1,
                    fillColor: "#111",
                  },
                  ...(maxValue > 0
                    ? [
                        {
                          seriesIndex: 0,
                          dataPointIndex: maxIndex,
                          fillColor: "#ff0000",
                        },
                      ]
                    : []),
                ],
          hover: { size: 8 },
        },
        xaxis: {
          categories: MONTHS,
          axisBorder: { color: "#e2e8f0" },
          labels: { style: { fontWeight: 500 } },
        },
        yaxis: {
          labels: {
            formatter: (v) => {
              if (v >= 1000000) return `${Math.round(v / 1000000)} Jt`;
              if (v >= 1000) return `${Math.round(v / 1000)} Rb`;
              return `${v}`;
            },
          },
        },
        grid: {
          strokeDashArray: 6,
          borderColor: "#e2e8f0",
        },
        tooltip: {
          shared: false,
          intersect: false,
          marker: { show: true },
          x: {
            formatter: (_: any, { dataPointIndex }) => MONTHS[dataPointIndex],
          },
          y: {
            formatter: (v) => rupiah(v),
            title: { formatter: () => "Jumlah" },
          },
          style: { fontSize: "14px" },
          theme: "light",
        },
      } as ApexCharts.ApexOptions,
    };
  }, [chartData]);
 const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);
  return (
   <div className="bg-white rounded-2xl shadow p-6">
      <header className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h1 className="text-3xl font-semibold">Statistik Pendapatan</h1>
        <select
          className="border border-slate-300 px-5 py-2 rounded-xl text-lg font-medium text-slate-800 bg-slate-50"
          value={selectedYear}
          onChange={onYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </header>

      <Chart options={options} type="area" series={series} height={360} />
    </div>
  );
};

export default StatistikPendapatan;
