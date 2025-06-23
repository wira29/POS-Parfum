import { useEffect, useState } from "react";
import { ScoreCard } from "@/views/pages/dashboard/ScoreCard";
import { Statistik } from "@/views/pages/dashboard/Statistik";
import { useApiClient } from "@/core/helpers/ApiClient";

interface DashboardData {
  total_products: number;
  total_orders: number;
  total_retail?: number;
  income_this_month: number;
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

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API = useApiClient();

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/dashboard");
      setDashboardData(response.data);
    } catch (err) {
      setError("Gagal memuat data dashboard");
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500 text-lg font-medium">{error}</div>
        <button
          onClick={getData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Tidak ada data</div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 flex-col">
      <ScoreCard data={dashboardData} />
      <Statistik data={dashboardData} />
    </div>
  );
};
