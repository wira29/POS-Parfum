import { IsAuth } from "@/core/middlewares/is-auth";
import { MainLayout } from "@/views/layouts/MainLayout";
import { Home } from "@/views/pages/home";
import { CategoryIndex, LoginPage, OutletIndex, ProductIndex, UserPage, WarehouseIndex } from "@/views/pages/pages";
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
                        element: <ProductIndex />,
                    }, {
                        path: "products",
                        element: <ProductIndex />
                    },
                    {
                        path: "categories",
                        element: <CategoryIndex />
                    }, {
                        path: "outlets",
                        element: <OutletIndex />
                    }, {
                        path: "warehouses",
                        element: <WarehouseIndex />
                    }, 
                    {
                        path: "users",
                        element: <UserPage />
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
    }
])