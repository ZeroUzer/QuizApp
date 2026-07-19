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
            if (quiz.category && !list.includes(quiz.category)) {
                list.push(quiz.category);
            }
        });
        return list;
    }, [quizzes]);

    const filtered = quizzes.filter((quiz) => {
        const searchOk =
            quiz.title.toLowerCase().includes(search.toLowerCase()) ||
            (quiz.description || "").toLowerCase().includes(search.toLowerCase());
        const categoryOk = category === "Все" || quiz.category === category;
        return searchOk && categoryOk;
    });

    return (
        <div className="home">
            {/* Hero секция */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <span className="hero-badge">Интерактивные квизы</span>
                        <h1>Проверь свои <br /><span className="gradient-text">знания</span> в игре</h1>
                        <p>Создавай викторины, участвуй в батлах, соревнуйся с друзьями и прокачивай свой интеллект!</p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Квизов</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">10K</span>
                                <span className="stat-label">Игроков</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">4.8</span>
                                <span className="stat-label">Рейтинг</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-illustration">
                        <div className="floating-card card-1">🧠</div>
                        <div className="floating-card card-2">🏆</div>
                        <div className="floating-card card-3">⚡</div>
                    </div>
                </div>
            </section>

            {/* Поиск и фильтры */}
            <section className="search-section">
                <div className="container">
                    <div className="search-wrapper">
                        <input
                            className="search-input"
                            placeholder="Ищи квизы по названию..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="categories">
                        {categories.map((item) => (
                            <button
                                key={item}
                                className={`category ${category === item ? "active" : ""}`}
                                onClick={() => setCategory(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Список квизов */}
            <section className="quizzes-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Популярные квизы</h2>
                        <span className="section-count">{filtered.length} доступно</span>
                    </div>
                    <div className="quiz-grid">
                        {filtered.length === 0 && (
                            <div className="empty-state">
                                <span className="empty-icon">📚</span>
                                <h3>Квизов пока нет</h3>
                                <p>Стань первым — создай свой квиз!</p>
                            </div>
                        )}
                        {filtered.map((quiz) => (
                            <div className="quiz-card" key={quiz.id}>
                                <div className="quiz-image-wrapper">
                                    <img
                                        src={
                                            quiz.image
                                                ? quiz.image
                                                : "https://placehold.co/700x420/6C63FF/FFFFFF?text=Quiz"
                                        }
                                        alt={quiz.title}
                                    />
                                    <span className="quiz-difficulty">
                                        {quiz.difficulty === "easy" && "Лёгкий"}
                                        {quiz.difficulty === "medium" && "Средний"}
                                        {quiz.difficulty === "hard" && "Сложный"}
                                    </span>
                                </div>
                                <div className="quiz-body">
                                    <div className="quiz-meta">
                                        <span className="badge">{quiz.category || "Другое"}</span>
                                        <span className="questions-count">
                                            {quiz.questions ? quiz.questions.length : 0} вопросов
                                        </span>
                                    </div>
                                    <h3>{quiz.title}</h3>
                                    <p>{quiz.description?.slice(0, 100)}</p>
                                    <div className="quiz-footer">
                                        <span className="quiz-author">{quiz.owner_username || "Аноним"}</span>
                                        <Link className="play-button" to={`/play/${quiz.id}`}>
                                            Играть →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;