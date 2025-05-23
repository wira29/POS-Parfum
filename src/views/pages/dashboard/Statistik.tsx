// import { useApiClient } from "@/core/helpers/ApiClient";
// import { useState } from "react";
import StatistikPendapatan from "./StatistikPendapatan";
import LatestOrder from "./LatestOrder";

export const Statistik = () => {
//   const [products, setProducts] = useState<{ [key: string]: any }[]>([]);

  return (
    <div className="w-full flex gap-5">
      <div className="flex-[9.5]">
        <StatistikPendapatan />
      </div>
      <div className="flex-[3]">
        <LatestOrder />
      </div>
    </div>
  );
};
