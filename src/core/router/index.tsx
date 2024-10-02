import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from '@/views/pages/authentication/LoginPage';
import { IsAuth } from "@/core/middlewares/is-auth";
import { Dashboard } from "@/views/pages/user/dashboard";
import { Home } from "@/views/pages/home";
import { MainLayout } from "@/views/layouts/MainLayout";
import { ProductIndex } from "@/views/pages/user/products";
import { RestockIndex } from "@/views/pages/user/restock";
import { AdjustmentIndex } from "@/views/pages/user/adjusment";
import { RestockTabIndex } from "@/views/pages/user/restock/tab";
import { RestockTabHistory } from "@/views/pages/user/restock/tab/history";

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