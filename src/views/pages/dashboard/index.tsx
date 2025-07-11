import { useEffect, useState } from "react";
import { ScoreCard } from "@/views/pages/dashboard/ScoreCard";
import { Statistik } from "@/views/pages/dashboard/Statistik";
import { useApiClient } from "@/core/helpers/ApiClient";
import { LoadingCards } from "@/views/components/Loading";
import { useAuthStore } from "@/core/stores/AuthStore";
import { Toast } from "@/core/helpers/BaseAlert";

interface DashboardData {
  total_products: number;
  total_orders: number;
  total_retail?: number;
  income_this_month: number;
  error: string | [];
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const API = useApiClient();
  const { setUserDefault } = useAuthStore();

  const getData = async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get(`/dashboard?year=${year}`);
      setDashboardData(response.data.data);
    } catch (err) {
      setError("Gagal memuat data dashboard");
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  if (loading) return <LoadingCards />;

  if (error || !dashboardData) {
    return <div className="text-red-500">{error || "Tidak ada data"}</div>;
  }

  if (dashboardData.error) {
    setUserDefault();
    Toast("error", "Login Gagal , Role anda tidak di kenali");
  }

  return (
    <div className="flex gap-6 flex-col">
      <ScoreCard data={dashboardData} />
      <Statistik
        data={dashboardData}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
    </div>
  );
};
