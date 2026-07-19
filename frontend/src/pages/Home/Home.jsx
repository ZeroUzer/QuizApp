import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getQuizzes } from "../../services/quiz";

import "./Home.css";

function Home() {
    const [quizzes, setQuizzes] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Все");

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            const data = await getQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.log(error);
        }
    };

    const categories = useMemo(() => {
        const list = ["Все"];

        quizzes.forEach((quiz) => {
            if (
                quiz.category &&
                !list.includes(quiz.category)
            ) {
                list.push(quiz.category);
            }
        });

        return list;
    }, [quizzes]);

    const filtered = quizzes.filter((quiz) => {
        const searchOk =
            quiz.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            (quiz.description || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const categoryOk =
            category === "Все" ||
            quiz.category === category;

        return searchOk && categoryOk;
    });

    return (
        <div className="home">

            <section className="hero">

                <div className="container">

                    <h1>
                        Найдите квиз по интересам
                    </h1>

                    <p>
                        Создавайте викторины, участвуйте в играх,
                        проверяйте знания и соревнуйтесь с друзьями.
                    </p>

                    <input
                        className="search"
                        placeholder="Поиск квизов..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </section>

            <section className="container">

                <div className="categories">

                    {categories.map((item) => (

                        <button
                            key={item}
                            className={
                                category === item
                                    ? "category active"
                                    : "category"
                            }
                            onClick={() =>
                                setCategory(item)
                            }
                        >
                            {item}
                        </button>

                    ))}

                </div>

            </section>

            <section className="container">

                <div className="quiz-grid">

                    {filtered.length === 0 && (

                        <div className="empty">

                            Пока нет квизов.

                        </div>

                    )}

                    {filtered.map((quiz) => (

                        <div
                            className="quiz-card"
                            key={quiz.id}
                        >

                            <img
                                src={
                                    quiz.image
                                        ? quiz.image
                                        : "https://placehold.co/700x420"
                                }
                                alt={quiz.title}
                            />

                            <div className="quiz-body">

                                <span className="badge">

                                    {quiz.category || "Другое"}

                                </span>

                                <h2>

                                    {quiz.title}

                                </h2>

                                <p>

                                    {quiz.description}

                                </p>

                                <div className="quiz-info">

                                    <span>

                                        Вопросов:{" "}
                                        {quiz.questions
                                            ? quiz.questions.length
                                            : 0}

                                    </span>

                                </div>

                                <Link
                                    className="play-button"
                                    to={`/quiz/${quiz.id}`}
                                >
                                    Подробнее
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default Home;