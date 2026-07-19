import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ username, password });
            navigate("/");
        } catch {
            setError("Неверный логин или пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Вход</h1>
                <p>Войдите в свой аккаунт</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Вход..." : "Войти"}
                    </button>
                </form>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-bottom">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;