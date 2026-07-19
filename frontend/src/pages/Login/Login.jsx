import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/auth";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            await login({

                username,

                password,

            });

            navigate("/dashboard");

        }

        catch {

            setError(

                "Неверный логин или пароль"

            );

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>

                    Вход

                </h1>

                <p>

                    Войдите в аккаунт организатора или участника

                </p>

                <form onSubmit={handleSubmit}>

                    <input

                        type="text"

                        placeholder="Логин"

                        value={username}

                        onChange={(e)=>

                            setUsername(

                                e.target.value

                            )

                        }

                    />

                    <input

                        type="password"

                        placeholder="Пароль"

                        value={password}

                        onChange={(e)=>

                            setPassword(

                                e.target.value

                            )

                        }

                    />

                    <button>

                        Войти

                    </button>

                </form>

                {

                    error &&

                    <div className="auth-error">

                        {error}

                    </div>

                }

                <div className="auth-bottom">

                    Нет аккаунта?

                    <Link to="/register">

                        Зарегистрироваться

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;