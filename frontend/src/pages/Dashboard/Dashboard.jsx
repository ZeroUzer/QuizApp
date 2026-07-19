import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "../../services/user";
import { logout } from "../../services/auth";

import {
    getQuizzes,
    createQuiz,
    deleteQuiz,
} from "../../services/quiz";

import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {

        load();

    }, []);

    const load = async () => {

        try {

            const profile = await getProfile();

            setUser(profile);

            const data = await getQuizzes();

            setQuizzes(data);

        }

        catch {

            logout();

            navigate("/login");

        }

    };

    const handleCreate = async (e) => {

        e.preventDefault();

        try {

            const quiz = await createQuiz({

                title,

                description,

                category,

                is_public: true,

                shuffle_questions: false,

                shuffle_answers: false,

            });

            setQuizzes([
                quiz,
                ...quizzes
            ]);

            setTitle("");
            setDescription("");
            setCategory("");

        }

        catch {

            alert("Ошибка создания");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Удалить квиз?")) {

            return;

        }

        await deleteQuiz(id);

        setQuizzes(

            quizzes.filter(

                q => q.id !== id

            )

        );

    };

    if (!user) {

        return <h2>Загрузка...</h2>;

    }

    return (

        <div className="dashboard">

            <div className="container">

                <div className="dashboard-header">

                    <div>

                        <h1>

                            Личный кабинет

                        </h1>

                        <p>

                            {user.username}

                        </p>

                        <p>

                            {user.email}

                        </p>

                    </div>

                    <button

                        className="logout"

                        onClick={() => {

                            logout();

                            navigate("/");

                        }}

                    >

                        Выйти

                    </button>

                </div>

                <div className="dashboard-grid">

                    <div className="create-card">

                        <h2>

                            Создать квиз

                        </h2>

                        <form onSubmit={handleCreate}>

                            <input

                                placeholder="Название"

                                value={title}

                                onChange={(e)=>setTitle(e.target.value)}

                            />

                            <textarea

                                placeholder="Описание"

                                value={description}

                                onChange={(e)=>setDescription(e.target.value)}

                            />

                            <input

                                placeholder="Категория"

                                value={category}

                                onChange={(e)=>setCategory(e.target.value)}

                            />

                            <button>

                                Создать квиз

                            </button>

                        </form>

                    </div>

                    <div>

                        <h2>

                            Мои квизы

                        </h2>

                        {

                            quizzes.map((quiz)=>(

                                <div

                                    className="quiz-row"

                                    key={quiz.id}

                                >

                                    <div>

                                        <h3>

                                            {quiz.title}

                                        </h3>

                                        <p>

                                            {quiz.category}

                                        </p>

                                    </div>

                                    <div className="buttons">

                                        <button

                                            onClick={()=>

                                                navigate(`/quiz/${quiz.id}`)

                                            }

                                        >

                                            Редактировать

                                        </button>

                                        <button

                                            className="delete"

                                            onClick={()=>

                                                handleDelete(quiz.id)

                                            }

                                        >

                                            Удалить

                                        </button>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;