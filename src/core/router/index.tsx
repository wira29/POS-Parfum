import { IsAuth } from "@/core/middlewares/is-auth";
import { MainLayout } from "@/views/layouts/MainLayout";
import { NotFoundPage } from "@/views/pages/errors";
import { Home } from "@/views/pages/home";
import { CategoryIndex, Dashboard, DiscountCreate, DiscountIndex, LoginPage, OutletIndex, ProductCreate, ProductEdit, ProductIndex, ProductShow, UserPage, VariantIndex, WarehouseIndex, WarehouseShow } from "@/views/pages/pages";
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

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />
    }, {
        path: "",
        element: <IsAuth guest={false} redirectOnError="/login" />,
        children: [
            {
                path: "",
                element: <MainLayout />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />,
                    }, {
                        path: "products",
                        element: <ProductIndex />
                    },
                    {
                        path: "products/create",
                        element: <ProductCreate />
                    },
                    {
                        path: "products/request",
                        element: <RequestStockIndex />
                    },
                    {
                        path: "products/:id",
                        element: <ProductShow />
                    },
                    {
                        path: "products/:id/edit",
                        element: <ProductEdit />
                    },
                    {
                        path: "categories",
                        element: <CategoryIndex />
                    },
                    {
                        path: "blendings",
                        element: <BlendingIndex />
                    },
                    {
                        path: "outlets",
                        element: <OutletIndex />
                    },
                    {
                        path: "warehouses",
                        element: <WarehouseIndex />
                    },
                    {
                        path: "warehouses/:id",
                        element: <WarehouseShow />
                    },
                    {
                        path: "users",
                        element: <UserPage />
                    },
                    {
                        path: "discounts",
                        element: <DiscountIndex />
                    },
                    {
                        path: "discounts/create",
                        element: <DiscountCreate />
                    },
                    {
                        path: "discounts/:id/edit",
                        element: <DiscountEdit />
                    }, {
                        path: "discounts/:id/detail",
                        element: <DiscountDetail />
                    },
                    {
                        path: "request-stock",
                        element: <RequestRestockIndex />
                    },
                    {
                        path: "restock",
                        element: <RestockIndex />
                    },
                    {
                        path: "audit",
                        element: <AuditIndex />
                    },
                    {
                        path: "audit/:id/detail",
                        element: <AuditDetail />
                    }
                ]
            }
        ]
    }, {
        path: "",
        element: <IsAuth guest={true} redirectOnError="/dashboard" />,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    }, {
        path: '*',
        element: <NotFoundPage />
    }
])