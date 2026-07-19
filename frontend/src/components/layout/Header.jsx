import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "../../services/auth";

function Header() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        setAuth(isAuthenticated());
    }, []);

    const handleLogout = () => {
        logout();
        setAuth(false);
        navigate("/");
    };

    return (
        <header style={{
            background: "#0a0a1a",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 0",
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(20px)",
        }}>
            <div className="container" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Link to="/" style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#fff",
                    textDecoration: "none",
                    letterSpacing: "-0.5px",
                }}>
                    Quiz<span style={{ color: "#6C63FF" }}>App</span>
                </Link>

                <nav style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                }}>
                    <Link to="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                        Главная
                    </Link>

                    {auth ? (
                        <>
                            <Link to="/dashboard" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                                Личный кабинет
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: "rgba(239,68,68,0.15)",
                                    border: "none",
                                    color: "#f87171",
                                    padding: "8px 20px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                }}
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                                Войти
                            </Link>
                            <Link
                                to="/register"
                                style={{
                                    background: "#6C63FF",
                                    padding: "8px 20px",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;