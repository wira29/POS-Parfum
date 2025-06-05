import { IsAuth } from "@/core/middlewares/is-auth";
import { MainLayout } from "@/views/layouts/MainLayout";
import { Register } from "@/views/pages/authentication/Registrasi";
import DiscountIndex from "@/views/pages/discount";
import { NotFoundPage } from "@/views/pages/errors";
import { Home } from "@/views/pages/home";
import {
  CategoryIndex,
  Dashboard,
  LoginPage,
  OutletIndex,
  ProductCreate,
  ProductEdit,
  ProductIndex,
  ProductShow,
  UserPage,
  VariantIndex,
  WarehouseIndex,
  WarehouseDetail,
  DiscountCreate,
  WarehouseCreate,
  WarehouseEdit,
  UserDetail,
  UserCreate,
  UserEdit,
  RetailIndex,
  BlendingCreate,
  RiwayatPenjualan,
  BlendingEdit
} from "@/views/pages/pages";
import RequestStockIndex from "@/views/pages/request-stock";
import { RequestRestockIndex } from "@/views/pages/restock/request";
import DetailReqProduct from "@/views/pages/restock/request/DetailReqProduct";
import ListReqProduct from "@/views/pages/restock/request/ListReqProduct";
import { RestockIndex } from "@/views/pages/restock/restock";
import { AuditIndex } from "@/views/pages/audit/index";
import { AuditDetail } from "@/views/pages/audit/detail";
import { DiscountDetail } from "@/views/pages/discount/detail";
import { createBrowserRouter } from "react-router-dom";
import { DiscountEdit } from "@/views/pages/discount/edit";
import BlendingIndex from "@/views/pages/blending"
import ProfitLossReportPage from "@/views/pages/laporan";
import ExpenseManagement from "@/views/pages/pengeluaran";
import RetailDetail from "@/views/pages/retail/detail";
import { BlendingDetail } from "@/views/pages/blending/detail";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "",
    element: <IsAuth guest={false} redirectOnError="/login" />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "products",
            element: <ProductIndex />,
          },
          {
            path: "retails",
            element: <RetailIndex />,
          },
          {
            path: "retails/:id/detail",
            element: <RetailDetail />,
          },
          {
            path: "products/create",
            element: <ProductCreate />,
          },
          {
            path: "products/request",
            element: <RequestStockIndex />,
          },
          {
            path: "products/:id",
            element: <ProductShow />,
          },
          {
            path: "blendings",
            element: <BlendingIndex />
          },
          {
            path: "blendings/:id/detail",
            element: <BlendingDetail />
          },
          {
            path: "blendings/create",
            element: <BlendingCreate />
          },
          {
            path: "blendings/:id/edit",
            element: <BlendingEdit />
          },
          {
            path: "products/:id/edit",
            element: <ProductEdit />,
          },
          {
            path: "categories",
            element: <CategoryIndex />,
          },
          {
            path: "variants",
            element: <VariantIndex />,
          },
          {
            path: "outlets",
            element: <OutletIndex />,
          },
          {
            path: "riwayat-penjualan",
            element: <RiwayatPenjualan />,
          },
          {
            path: "warehouses",
            element: <WarehouseIndex />,
          },
          {
            path: "warehouses/create",
            element: <WarehouseCreate />,
          },
          {
            path: "warehouses/:id/edit",
            element: <WarehouseEdit />,
          },
          {
            path: "warehouses/:id/details",
            element: <WarehouseDetail />,
          },
          {
            path: "users",
            element: <UserPage />,
          },
          {
            path: "users/create",
            element: <UserCreate />,
          },
          {
            path: "users/:id/edit",
            element: <UserEdit />,
          },
          {
            path: "users/:id/Detail",
            element: <UserDetail />,
          },
          {
            path: "discounts",
            element: <DiscountIndex />,
          },
          {
            path: "discounts/create",
            element: <DiscountCreate />,
          },
          {
            path: "discounts/:id/edit",
            element: <DiscountEdit />,
          },
          {
            path: "discounts/:id/detail",
            element: <DiscountDetail />,
          },
          {
            path: "request-stock",
            element: <RequestRestockIndex />,
            children: [
              {
                index: true,
                element: <ListReqProduct />,
              },
              {
                path: ":id",
                element: <DetailReqProduct />,
              },
            ],
          },
          {
            path: "restock",
            element: <RestockIndex />,
          },
          {
            path: "audit",
            element: <AuditIndex />
          },
          {
            path: "audit/:id/detail",
            element: <AuditDetail />
          },
          {
            path: "laporan",
            element: <ProfitLossReportPage />,
          },
          {
            path: "pengeluaran",
            element: <ExpenseManagement />,
          },
          {
            path: "pengeluaran/create",
            element: <ExpenseCreate/>,
          },
        ],
      },
    ],
  },
  {
    path: "",
    element: <IsAuth guest={true} redirectOnError="/dashboard" />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },

]);