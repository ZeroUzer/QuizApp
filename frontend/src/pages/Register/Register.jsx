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




    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");



        try {


            await register({

                username,

                email,

                password,

                role,

            });



            setSuccess(

                "Регистрация успешна"

            );



            setTimeout(() => {


                navigate("/login");


            }, 1000);



        }

        catch {


            setError(

                "Ошибка регистрации"

            );


        }


    };





    return (


        <div className="auth-page">


            <div className="auth-card">



                <h1>

                    Регистрация

                </h1>



                <p>

                    Создайте аккаунт для работы с квизами

                </p>




                <form onSubmit={handleSubmit}>



                    <input

                        type="text"

                        placeholder="Имя пользователя"

                        value={username}

                        onChange={(e)=>

                            setUsername(

                                e.target.value

                            )

                        }

                    />




                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e)=>

                            setEmail(

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





                    <select

                        value={role}

                        onChange={(e)=>

                            setRole(

                                e.target.value

                            )

                        }

                    >


                        <option value="participant">

                            Участник

                        </option>



                        <option value="host">

                            Организатор

                        </option>


                    </select>





                    <button>

                        Создать аккаунт

                    </button>



                </form>





                {

                    error &&


                    <div className="auth-error">

                        {error}

                    </div>


                }






                {

                    success &&


                    <div className="auth-success">

                        {success}

                    </div>


                }





                <div className="auth-bottom">


                    Уже есть аккаунт?


                    <Link to="/login">

                        Войти

                    </Link>



                </div>




            </div>



        </div>


    );


}



export default Register;