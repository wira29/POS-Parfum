import { IsAuth } from "@/core/middlewares/is-auth";
import { MainLayout } from "@/views/layouts/MainLayout";
import { Home } from "@/views/pages/home";
import { CategoryIndex, LoginPage, OutletIndex, ProductIndex, WarehouseIndex } from "@/views/pages/pages";
import { AdjustmentIndex } from "@/views/pages/user/adjusment";
import { Dashboard } from "@/views/pages/user/dashboard";
import { RestockIndex } from "@/views/pages/user/restock";
import { RestockTabIndex } from "@/views/pages/user/restock/tab";
import { RestockTabHistory } from "@/views/pages/user/restock/tab/history";
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
                    }, {
                        path: "outlets",
                        element: <OutletIndex />
                    }, {
                        path: "warehouses",
                        element: <WarehouseIndex />
                    }, {
                        path: "restocking",
                        element: <RestockIndex />,
                        children: [
                            {
                                index: true,
                                element: <RestockTabIndex />
                            },
                            {
                                path: "history",
                                element: <RestockTabHistory />
                            }
                        ]
                    }, {
                        path: "stock-adjustment",
                        element: <AdjustmentIndex />
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