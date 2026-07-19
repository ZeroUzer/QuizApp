import { createBrowserRouter, Outlet } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import QuizEditor from "./pages/QuizEditor/QuizEditor";
import QuizPlay from "./pages/QuizPlay/QuizPlay";

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
            { path: "/", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/quiz/:id", element: <QuizEditor /> },
            { path: "/play/:id", element: <QuizPlay /> },
            {
                path: "*",
                element: (
                    <div style={{
                        minHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        background: "#0a0a1a",
                        fontFamily: "'Inter', sans-serif",
                        padding: "24px",
                    }}>
                        <h1 style={{ fontSize: "72px", margin: 0 }}>404</h1>
                        <p style={{ color: "rgba(255,255,255,0.3)" }}>Страница не найдена</p>
                        <a href="/" style={{
                            marginTop: "20px",
                            padding: "12px 32px",
                            borderRadius: "12px",
                            background: "#6C63FF",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 600,
                        }}>На главную</a>
                    </div>
                ),
            },
        ],
    },
]);

export default router;