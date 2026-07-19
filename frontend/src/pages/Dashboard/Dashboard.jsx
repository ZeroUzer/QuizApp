import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/user";
import { logout } from "../../services/auth";
import { getMyQuizzes, createQuiz, deleteQuiz } from "../../services/quiz";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [timeLimit, setTimeLimit] = useState(30);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const profile = await getProfile();
            setUser(profile);
            const data = await getMyQuizzes();
            setQuizzes(data);
        } catch {
            logout();
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("Введите название квиза");
            return;
        }
        setIsCreating(true);
        try {
            const quiz = await createQuiz({
                title,
                description,
                category,
                time_limit: timeLimit,
                is_public: true,
            });
            setQuizzes([quiz, ...quizzes]);
            setTitle("");
            setDescription("");
            setCategory("");
            setTimeLimit(30);
        } catch (error) {
            alert("Ошибка создания квиза");
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить этот квиз?")) return;
        try {
            await deleteQuiz(id);
            setQuizzes(quizzes.filter((q) => q.id !== id));
        } catch {
            alert("Ошибка удаления");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="container">
                {/* Профиль */}
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="profile-details">
                            <h1>{user?.username}</h1>
                            <p className="profile-email">{user?.email}</p>
                            <span className={`profile-role ${user?.role}`}>
                                {user?.role === "organizer" ? "Организатор" : "Участник"}
                            </span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
                        Выйти
                    </button>
                </div>

                <div className="dashboard-grid">
                    {/* Создание квиза */}
                    <div className="create-card">
                        <h2>Создать квиз</h2>
                        <form onSubmit={handleCreate}>
                            <input
                                placeholder="Название квиза"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                            <input
                                placeholder="Категория"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <div className="form-row">
                                <label>Время на вопрос (сек)</label>
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    min="5"
                                    max="300"
                                />
                            </div>
                            <button type="submit" disabled={isCreating}>
                                {isCreating ? "Создание..." : "+ Создать квиз"}
                            </button>
                        </form>
                    </div>

                    {/* Список квизов */}
                    <div className="quizzes-list">
                        <div className="list-header">
                            <h2>Мои квизы</h2>
                            <span className="quiz-count">{quizzes.length} шт.</span>
                        </div>
                        {quizzes.length === 0 && (
                            <div className="empty-quizzes">
                                <p>У вас пока нет квизов</p>
                            </div>
                        )}
                        {quizzes.map((quiz) => (
                            <div className="quiz-row" key={quiz.id}>
                                <div className="quiz-row-info">
                                    <h3>{quiz.title}</h3>
                                    <div className="quiz-row-meta">
                                        <span className="row-category">{quiz.category || "Другое"}</span>
                                        <span className="row-questions">
                                            {quiz.questions_count || 0} вопросов
                                        </span>
                                        <span className="row-time">⏱ {quiz.time_limit || 30}с</span>
                                    </div>
                                </div>
                                <div className="quiz-row-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(quiz.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;