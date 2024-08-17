import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from '@/pages/authentication/LoginPage';
import { IsAuth } from "./middlewares/is-auth";
import { Dashboard } from "@/pages/user/dashboard";
import { Home } from "@/pages/home";
import { MainLayout } from "@/layouts/MainLayout";
import { ProductIndex } from "@/pages/user/products";
import { RestockIndex } from "@/pages/user/restock";
import { AdjustmentIndex } from "@/pages/user/adjusment";
import { RestockTabIndex } from "@/pages/user/restock/tab";
import { RestockTabHistory } from "@/pages/user/restock/tab/history";

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