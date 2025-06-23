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
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // default: tahun ini
  const API = useApiClient();

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
<<<<<<< HEAD
    getData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

=======
    getData();
  }, []);  
  console.log(dashboardData);
  
>>>>>>> c99651fd15c882f85a8a9b536714e7ade807a200
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  if (error || !dashboardData) {
    return <div className="text-red-500">{error || "Tidak ada data"}</div>;
  }

  return (
    <div className="flex gap-6 flex-col">
      <ScoreCard data={dashboardData} />
      <Statistik data={dashboardData} selectedYear={selectedYear} onYearChange={handleYearChange} />
    </div>
  );
};
