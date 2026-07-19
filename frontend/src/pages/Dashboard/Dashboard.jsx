import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/user";
import { logout } from "../../services/auth";
import { getMyQuizzes, createQuiz, deleteQuiz } from "../../services/quiz";
import { createQuestion } from "../../services/question";
import { createAnswer } from "../../services/answer";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importStatus, setImportStatus] = useState("");
    const fileInputRef = useRef(null);

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
                is_public: true,
                shuffle_questions: false,
                shuffle_answers: false,
            });
            setQuizzes([quiz, ...quizzes]);
            setTitle("");
            setDescription("");
            setCategory("");
        } catch {
            alert("Ошибка создания квиза");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить этот квиз?")) return;
        await deleteQuiz(id);
        setQuizzes(quizzes.filter((q) => q.id !== id));
    };

    const parseJSON = (content) => {
        const data = JSON.parse(content);
        return {
            title: data.title || "Импортированный квиз",
            description: data.description || "",
            category: data.category || "Другое",
            questions: data.questions || [],
        };
    };

    const parseCSV = (content) => {
        const lines = content.split("\n").filter(line => line.trim());
        if (lines.length < 2) throw new Error("CSV должен содержать заголовок и хотя бы один вопрос");
        
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const questionIdx = headers.indexOf("question");
        const answerIdx = headers.indexOf("answer");
        const correctIdx = headers.indexOf("correct");
        
        if (questionIdx === -1 || answerIdx === -1) {
            throw new Error("CSV должен содержать колонки: question, answer, correct (опционально)");
        }

        const questionsMap = {};
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map(c => c.trim());
            const questionText = cols[questionIdx] || "";
            const answerText = cols[answerIdx] || "";
            const isCorrect = correctIdx !== -1 && cols[correctIdx]?.toLowerCase() === "true";

            if (!questionText) continue;
            
            if (!questionsMap[questionText]) {
                questionsMap[questionText] = {
                    text: questionText,
                    options: [],
                };
            }
            if (answerText) {
                questionsMap[questionText].options.push({
                    text: answerText,
                    is_correct: isCorrect,
                });
            }
        }

        const questions = Object.values(questionsMap).map((q, idx) => ({
            ...q,
            order: idx + 1,
            allow_multiple_answers: q.options.filter(o => o.is_correct).length > 1,
        }));

        return {
            title: "Импортированный квиз",
            description: "",
            category: "Другое",
            questions,
        };
    };

    const parseTXT = (content) => {
        const lines = content.split("\n").filter(line => line.trim());
        let title = "Импортированный квиз";
        let description = "";
        let questions = [];
        let currentQuestion = null;

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Заголовок квиза
            if (trimmed.startsWith("# ")) {
                title = trimmed.slice(2).trim();
                continue;
            }
            
            // Описание
            if (trimmed.startsWith("## ")) {
                description = trimmed.slice(3).trim();
                continue;
            }

            // Вопрос
            if (trimmed.match(/^\d+\.\s/) || trimmed.match(/^\?\s*/)) {
                const text = trimmed.replace(/^\d+\.\s*/, "").replace(/^\?\s*/, "");
                if (currentQuestion && currentQuestion.options.length > 0) {
                    questions.push(currentQuestion);
                }
                currentQuestion = {
                    text: text,
                    options: [],
                    allow_multiple_answers: false,
                };
                continue;
            }

            // Вариант ответа
            if (currentQuestion && (trimmed.startsWith("- ") || trimmed.startsWith("* "))) {
                const isCorrect = trimmed.includes("[x]") || trimmed.includes("[✓]") || trimmed.includes("(правильно)");
                const text = trimmed.replace(/^[-*]\s*/, "").replace(/\[x\]|\[✓\]|\(правильно\)/g, "").trim();
                if (text) {
                    currentQuestion.options.push({
                        text: text,
                        is_correct: isCorrect,
                    });
                }
                continue;
            }

            // Если просто текст без маркера - добавляем как ответ
            if (currentQuestion && trimmed && !trimmed.startsWith("#") && !trimmed.match(/^\d+\.\s/)) {
                const isCorrect = trimmed.includes("[x]") || trimmed.includes("[✓]") || trimmed.includes("(правильно)");
                const text = trimmed.replace(/\[x\]|\[✓\]|\(правильно\)/g, "").trim();
                if (text) {
                    currentQuestion.options.push({
                        text: text,
                        is_correct: isCorrect,
                    });
                }
            }
        }

        if (currentQuestion && currentQuestion.options.length > 0) {
            questions.push(currentQuestion);
        }

        // Определяем множественный выбор
        questions = questions.map(q => ({
            ...q,
            allow_multiple_answers: q.options.filter(o => o.is_correct).length > 1,
            order: questions.indexOf(q) + 1,
        }));

        return { title, description, category: "Другое", questions };
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!importFile) {
            alert("Выберите файл для импорта");
            return;
        }

        setIsImporting(true);
        setImportStatus("Чтение файла...");

        try {
            const content = await importFile.text();
            let parsed;

            setImportStatus("Обработка данных...");

            if (importFile.name.endsWith(".json")) {
                parsed = parseJSON(content);
            } else if (importFile.name.endsWith(".csv")) {
                parsed = parseCSV(content);
            } else if (importFile.name.endsWith(".txt")) {
                parsed = parseTXT(content);
            } else {
                throw new Error("Поддерживаются только .json, .csv, .txt");
            }

            if (!parsed.questions || parsed.questions.length === 0) {
                throw new Error("В файле не найдено вопросов");
            }

            setImportStatus("Создание квиза...");

            // Создаём квиз
            const quiz = await createQuiz({
                title: parsed.title || "Импортированный квиз",
                description: parsed.description || "",
                category: parsed.category || "Другое",
                is_public: true,
                shuffle_questions: false,
                shuffle_answers: false,
            });

            setImportStatus(`Создание ${parsed.questions.length} вопросов...`);

            // Создаём вопросы и ответы
            for (const q of parsed.questions) {
                const question = await createQuestion({
                    quiz: quiz.id,
                    text: q.text,
                    allow_multiple_answers: q.allow_multiple_answers || false,
                    time_limit: 30,
                    order: q.order || parsed.questions.indexOf(q) + 1,
                });

                for (const opt of q.options) {
                    if (opt.text) {
                        await createAnswer({
                            question: question.id,
                            text: opt.text,
                            is_correct: opt.is_correct || false,
                        });
                    }
                }
            }

            setQuizzes([quiz, ...quizzes]);
            setImportStatus("Импорт завершён!");
            setImportFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            setTimeout(() => setImportStatus(""), 3000);

        } catch (err) {
            setImportStatus(`Ошибка: ${err.message}`);
            setTimeout(() => setImportStatus(""), 5000);
        } finally {
            setIsImporting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const ext = file.name.split(".").pop().toLowerCase();
            if (!["json", "csv", "txt"].includes(ext)) {
                alert("Поддерживаются только .json, .csv, .txt");
                e.target.value = "";
                return;
            }
            setImportFile(file);
        }
    };

    if (!user) {
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
                            {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="profile-details">
                            <h1>{user.username}</h1>
                            <p className="profile-email">{user.email}</p>
                            <span className={`profile-role ${user.role}`}>
                                {user.role === "organizer" ? "Организатор" : "Участник"}
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
                                placeholder="Описание квиза"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                            <input
                                placeholder="Категория (например: История, Наука)"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <button type="submit" disabled={isCreating}>
                                {isCreating ? "Создание..." : "+ Создать квиз"}
                            </button>
                        </form>

                        <div className="import-divider">
                            <span>или импортировать из файла</span>
                        </div>

                        <form onSubmit={handleImport} className="import-form">
                            <div className="file-upload-wrapper">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json,.csv,.txt"
                                    onChange={handleFileChange}
                                    className="file-input"
                                    id="file-upload"
                                    disabled={isImporting}
                                />
                                <label htmlFor="file-upload" className="file-label">
                                    {importFile ? importFile.name : "Выберите файл"}
                                </label>
                            </div>
                            <div className="import-hint">
                                <span>Поддерживаемые форматы: JSON, CSV, TXT</span>
                            </div>
                            <button type="submit" disabled={!importFile || isImporting}>
                                {isImporting ? "Импорт..." : "📥 Импортировать"}
                            </button>
                            {importStatus && (
                                <div className={`import-status ${importStatus.includes("Ошибка") ? "error" : importStatus.includes("завершён") ? "success" : ""}`}>
                                    {importStatus}
                                </div>
                            )}
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
                                <div className="empty-icon">📝</div>
                                <h3>У вас пока нет квизов</h3>
                                <p>Создайте первый квиз или импортируйте из файла!</p>
                            </div>
                        )}
                        {quizzes.map((quiz) => (
                            <div className="quiz-row" key={quiz.id}>
                                <div className="quiz-row-info">
                                    <h3>{quiz.title}</h3>
                                    <div className="quiz-row-meta">
                                        <span className="row-category">{quiz.category || "Другое"}</span>
                                        <span className="row-questions">
                                            {quiz.questions?.length || 0} вопросов
                                        </span>
                                        <span className={`row-status ${quiz.is_public ? "public" : "private"}`}>
                                            {quiz.is_public ? "Публичный" : "Приватный"}
                                        </span>
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