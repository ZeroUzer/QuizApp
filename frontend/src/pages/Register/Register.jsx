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
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await register({ username, email, password, role });
            setSuccess("Регистрация успешна!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const msg = err?.response?.data?.username?.[0] ||
                       err?.response?.data?.email?.[0] ||
                       err?.response?.data?.password?.[0] ||
                       "Ошибка регистрации";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
                <h1>Регистрация</h1>
                <p>Создайте аккаунт</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль (минимум 6 символов)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="participant">Участник</option>
                        <option value="organizer">Организатор</option>
                    </select>
                    <button type="submit" disabled={loading}>
                        {loading ? "Регистрация..." : "Создать аккаунт"}
                    </button>
                </form>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <div className="auth-bottom">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;