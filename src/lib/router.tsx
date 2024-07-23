import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from '@/pages/authentication/LoginPage';

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />
    }
])