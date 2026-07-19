import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("participant");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await register({ username, email, password, role });
            setSuccess("Регистрация успешна! Перенаправление...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const msg = err?.response?.data?.username?.[0] ||
                       err?.response?.data?.email?.[0] ||
                       err?.response?.data?.password?.[0] ||
                       "Ошибка регистрации. Попробуйте ещё раз.";
            setError(msg);
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
            <div className="auth-card register-card">
                <div className="auth-card-icon">🚀</div>
                <h1>Создать аккаунт</h1>
                <p>Присоединяйся к сообществу квизов</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            placeholder="Придумайте логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label>Роль</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="participant">Участник</option>
                            <option value="organizer">Организатор</option>
                        </select>
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Регистрация..." : "Создать аккаунт"}
                    </button>
                </form>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <div className="auth-bottom">
                    <span>Уже есть аккаунт?</span>
                    <Link to="/login">Войти</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;