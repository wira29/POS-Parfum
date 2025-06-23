import StatistikPendapatan from "./StatistikPendapatan";
import LatestOrder from "./LatestOrder";
import LowStockproduct from "./LowStockProducts";

interface StatistikProps {
  data: DashboardData;
  selectedYear: number;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface DashboardData {
  chart: {
    year: number;
    data: number[];
  };
  recent_orders: Array<{
    id?: string;
    title: string;
    message: string;
    created_at?: string;
  }>;
  low_stock_products?: Array<{
    name: string;
    stock: number;
    unit: string;
  }>;
  role: string;
}

interface StatistikProps {
  data: DashboardData;
}

export const Statistik = ({
  data,
  selectedYear,
  onYearChange,
}: StatistikProps) => {
  return (
    <div className="w-full flex gap-5">
      <div className="flex-[9.5]">
        <StatistikPendapatan
          chartData={data.chart}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
        />
      </div>
      <div className="flex-[3]">
        {data.role === "outlet" ? (
          <LowStockproduct product={data.low_stock_products} />
        ) : (
          <LatestOrder orders={data.recent_orders} />
        )}
      </div>
    </div>
  );
};
