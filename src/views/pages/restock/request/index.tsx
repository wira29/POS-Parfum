import React from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { Outlet } from "react-router-dom";

export const RequestRestockIndex: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-5">
      <Breadcrumb
        title="Request Pembelian Retail"
        desc="Request pembelian produk dari retail akan muncul disini!"
      />

      <Outlet />
    </div>
  );
};

export default RequestRestockIndex;
