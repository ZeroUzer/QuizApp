import { createBrowserRouter, Outlet } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import QuizEditor from "./pages/QuizEditor/QuizEditor";

function RootLayout() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },

            {
                path: "/login",
                element: <Login />,
            },

            {
                path: "/register",
                element: <Register />,
            },

            {
                path: "/dashboard",
                element: <Dashboard />,
            },

            {
                path: "/quiz/:id",
                element: <QuizEditor />,
            },

            {
                path: "*",
                element: (
                    <div>
                        <h1>404</h1>
                        <p>Страница не найдена.</p>
                    </div>
                ),
            },
        ],
    },
]);

export default router;