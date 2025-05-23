import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
const rupiah = (v: number) =>
  `Rp ${v.toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;

const MONTHS = [
  "Jan","Feb","Mar","Apr","Mei","Jun",
  "Jul","Agst","Seo","Okt","Nov","Des",
];

const DATA_PER_YEAR: Record<number, number[]> = {
  2023: [50, 200, 80, 300, 60, 400, 50, 320, 90, 60, 250, 70],
  2024: [60, 150, 90, 310, 120, 380, 45, 290, 130, 70, 200, 90],
  2025: [55, 170, 85, 260, 100, 420, 75, 340, 110, 80, 230, 60],
};

const StatistikPendapatan: React.FC = () => {
  const [year, setYear] = useState<number>(2024);

  const { series, options } = useMemo(() => {
    const data = DATA_PER_YEAR[year];
    const maxIndex = data.indexOf(Math.max(...data));
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
          discrete: [
            { seriesIndex: 0, dataPointIndex: 0, fillColor: "#111" },
            { seriesIndex: 0, dataPointIndex: data.length - 1, fillColor: "#111" },
            { seriesIndex: 0, dataPointIndex: maxIndex, fillColor: "#ff0000" },
          ],
          hover: { size: 8 },
        },
        xaxis: {
          categories: MONTHS,
          axisBorder: { color: "#e2e8f0" },
          labels: { style: { fontWeight: 500 } },
        },
        yaxis: {
          labels: { formatter: (v) => `${v} Jt` },
        },
        grid: {
          strokeDashArray: 6,
          borderColor: "#e2e8f0",
        },
        tooltip: {
          shared: false,
          intersect: false,
          marker: { show: true },
          x: { formatter: (_: any, { dataPointIndex }) => MONTHS[dataPointIndex] },
          y: {
            formatter: (v) => rupiah(v * 1_000_000),
            title: { formatter: () => "Jumlah" },
          },
          style: { fontSize: "14px" },
          theme: "light",
        },
      } as ApexCharts.ApexOptions,
    };
  }, [year]);

  return (
      <div className="bg-white rounded-2xl shadow p-6">
        <header className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold">Statistik Pendapatan</h1>
          <select
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="border border-slate-300 focus:outline-none px-5 py-2 rounded-xl text-lg font-medium text-slate-800 hover:bg-slate-50"
          >
            {Object.keys(DATA_PER_YEAR).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </header>

        <Chart options={options} series={series} height={360} />
      </div>
  );
};

export default StatistikPendapatan;
