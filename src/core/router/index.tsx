import { IsAuth } from "@/core/middlewares/is-auth";
import { MainLayout } from "@/views/layouts/MainLayout";
import DiscountIndex from "@/views/pages/discount";
import { NotFoundPage } from "@/views/pages/errors";
import { Home } from "@/views/pages/home";
import { CategoryIndex, Dashboard, LoginPage, OutletIndex, ProductIndex, UserPage, VariantIndex, WarehouseIndex } from "@/views/pages/pages";
import { createBrowserRouter } from "react-router-dom";

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
                        path: "categories",
                        element: <CategoryIndex />
                    },
                    {
                        path: "variants",
                        element: <VariantIndex />
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
                        path: "users",
                        element: <UserPage />
                    },
                    {
                        path: "discounts",
                        element: <DiscountIndex />
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