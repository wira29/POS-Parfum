import { IsAuth } from "@/core/middlewares/is-auth";
import { MainLayout } from "@/views/layouts/MainLayout";
import { NotFoundPage } from "@/views/pages/errors";
import { Home } from "@/views/pages/home";
import {
  CategoryIndex,
  DiscountIndex,
  DiscountCreate,
  Dashboard,
  LoginPage,
  Register,
  OutletIndex,
  ProductCreate,
  ProductEdit,
  ProductIndex,
  ProductShow,
  UserPage, 
  UserDetail, 
  UserCreate, 
  UserEdit, 
  VariantIndex, 
  WarehouseIndex, 
  WarehouseDetail, 
  WarehouseCreate, 
  WarehouseEdit,
  DiscountEdit
} from "@/views/pages/pages";
import RequestStockIndex from "@/views/pages/request-stock";
import { RequestRestockIndex } from "@/views/pages/restock/request";
import { RestockIndex } from "@/views/pages/restock/restock";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "",
    element: <IsAuth guest={false} redirectOnError="/login" />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "products", element: <ProductIndex /> },
          { path: "products/create", element: <ProductCreate /> },
          { path: "products/request", element: <RequestStockIndex /> },
          { path: "products/:id", element: <ProductShow /> },
          { path: "products/:id/edit", element: <ProductEdit /> },
          { path: "categories", element: <CategoryIndex /> },
          { path: "variants", element: <VariantIndex /> },
          { path: "outlets", element: <OutletIndex /> },
          { path: "warehouses", element: <WarehouseIndex /> }, 
          { path: "warehouses/create", element: <WarehouseCreate /> },
          { path: "warehouses/:id", element: <WarehouseDetail /> }, 
          { path: "warehouses/:id/edit", element: <WarehouseEdit /> }, 
          { path: "users", element: <UserPage /> },
          { path: "users/create", element: <UserCreate />  },
          { path: "users/:id", element: <UserDetail /> }, 
          { path: "users/:id/edit", element: <UserEdit /> },
          { path: "users", element: <UserPage /> },
          { path: "discounts", element: <DiscountIndex /> },
          { path: "discounts/create", element: <DiscountCreate /> },
          { path: "discounts/:id/edit", element: <DiscountEdit /> },
          { path: "request-stock", element: <RequestRestockIndex /> },
          { path: "restock", element: <RestockIndex /> },
        ]
      }
    ]
  },
  {
    path: "",
    element: <IsAuth guest={true} redirectOnError="/dashboard" />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);