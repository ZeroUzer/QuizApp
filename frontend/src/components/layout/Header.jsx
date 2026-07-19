import { Link } from "react-router-dom";

function Header() {
    return (
        <header
            style={{
                background: "#1e3a8a",
                color: "white",
                padding: "18px 0",
                boxShadow: "0 2px 10px rgba(0,0,0,.15)"
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Link
                    to="/"
                    style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        color: "white"
                    }}
                >
                    QuizApp
                </Link>

                <nav
                    style={{
                        display: "flex",
                        gap: "25px",
                        alignItems: "center"
                    }}
                >
                    <Link to="/">Главная</Link>

                    <Link to="/dashboard">
                        Личный кабинет
                    </Link>

                    <Link to="/login">
                        Войти
                    </Link>

                    <Link
                        to="/register"
                        style={{
                            background: "#2563eb",
                            padding: "10px 18px",
                            borderRadius: "8px",
                            color: "white"
                        }}
                    >
                        Регистрация
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;