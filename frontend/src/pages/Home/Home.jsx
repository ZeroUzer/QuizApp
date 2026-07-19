import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizzes } from "../../services/quiz";
import "./Home.css";

function Home() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            const data = await getQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error("Ошибка загрузки квизов:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(search.toLowerCase()) ||
        (quiz.description || "").toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="home">
            <div className="container">
                {/* Поиск */}
                <div className="search-section">
                    <h1>Все квизы</h1>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск квизов..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Список квизов */}
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>Квизов не найдено</p>
                    </div>
                ) : (
                    <div className="quiz-grid">
                        {filtered.map((quiz) => (
                            <div className="quiz-card" key={quiz.id}>
                                <div className="quiz-card-body">
                                    <span className="quiz-category">{quiz.category || "Другое"}</span>
                                    <h3>{quiz.title}</h3>
                                    <p>{quiz.description || "Без описания"}</p>
                                    <div className="quiz-card-footer">
                                        <span className="quiz-questions">
                                            {quiz.questions_count || 0} вопросов
                                        </span>
                                        <Link to={`/play/${quiz.id}`} className="play-btn">
                                            Играть
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;