import StatistikPendapatan from "./StatistikPendapatan";
import LatestOrder from "./LatestOrder";
import LowStockproduct from "./LowStockProducts";

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

export const Statistik = ({ data }: StatistikProps) => { 
  console.log(data);
     
  return (
    <div className="w-full flex gap-5">
      <div className="flex-[9.5]">
        <StatistikPendapatan chartData={data.chart} />
      </div>
      <div className="flex-[3]">
        {data.role === "outlet" ? (
          <LowStockproduct product={data.low_stock_products} />
        ): (
          <LatestOrder orders={data.recent_orders} />
        )}
      </div>
    </div>
  );
};