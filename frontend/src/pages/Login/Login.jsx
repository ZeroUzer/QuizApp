import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login({ username, password });
            navigate("/dashboard");
        } catch {
            setError("Неверный логин или пароль");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-bg-blob blob-1"></div>
                <div className="auth-bg-blob blob-2"></div>
                <div className="auth-bg-blob blob-3"></div>
            </div>
            <div className="auth-card">
                <div className="auth-card-icon">🔐</div>
                <h1>Добро пожаловать</h1>
                <p>Войдите в аккаунт, чтобы продолжить</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            placeholder="Введите логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Вход..." : "Войти"}
                    </button>
                </form>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-bottom">
                    <span>Нет аккаунта?</span>
                    <Link to="/register">Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;