import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from "./services/auth";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import QuizEditor from "./pages/QuizEditor/QuizEditor";
import QuizPlay from "./pages/QuizPlay/QuizPlay";

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

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
            {
                path: "/dashboard",
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "/quiz/:id",
                element: (
                    <PrivateRoute>
                        <QuizEditor />
                    </PrivateRoute>
                ),
            },
            { path: "/play/:id", element: <QuizPlay /> },
            {
                path: "*",
                element: (
                    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "#0a0a1a" }}>
                        <h1>404</h1>
                    </div>
                ),
            },
        ],
    },
]);

export default router;