import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import QuestionCard from "../../components/quiz/QuestionCard";
import { getQuiz } from "../../services/quiz";
import { createQuestion, deleteQuestion } from "../../services/question";
import { getAnswers, createAnswer, deleteAnswer } from "../../services/answer";
import "./QuizEditor.css";

function QuizEditor() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [answerText, setAnswerText] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isAddingAnswer, setIsAddingAnswer] = useState(false);

    useEffect(() => {
        load();
    }, [id]);

    const load = async () => {
        const quizData = await getQuiz(id);
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
        const answerData = await getAnswers();
        setAnswers(answerData);
    };

    const addQuestion = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;
        setIsAddingQuestion(true);
        try {
            const question = await createQuestion({
                quiz: id,
                text: questionText,
                allow_multiple_answers: false,
                time_limit: 30,
                order: questions.length + 1,
            });
            setQuestions([...questions, question]);
            setQuestionText("");
        } catch {
            alert("Ошибка создания вопроса");
        } finally {
            setIsAddingQuestion(false);
        }
    };

    const addAnswer = async (e) => {
        e.preventDefault();
        if (!selectedQuestion) return;
        if (!answerText.trim()) return;
        setIsAddingAnswer(true);
        try {
            const answer = await createAnswer({
                question: selectedQuestion,
                text: answerText,
                is_correct: false,
            });
            setAnswers([...answers, answer]);
            setAnswerText("");
        } catch {
            alert("Ошибка создания ответа");
        } finally {
            setIsAddingAnswer(false);
        }
    };

    const removeQuestion = async (questionId) => {
        if (!window.confirm("Удалить этот вопрос?")) return;
        await deleteQuestion(questionId);
        setQuestions(questions.filter((q) => q.id !== questionId));
        setAnswers(answers.filter((a) => a.question !== questionId));
        if (selectedQuestion === questionId) {
            setSelectedQuestion(null);
        }
    };

    const removeAnswer = async (answerId) => {
        if (!window.confirm("Удалить этот вариант ответа?")) return;
        await deleteAnswer(answerId);
        setAnswers(answers.filter((a) => a.id !== answerId));
    };

    const toggleCorrect = async (answerId) => {
        const answer = answers.find((a) => a.id === answerId);
        if (!answer) return;
        // Если у вопроса один правильный ответ, снимаем все остальные
        const question = questions.find((q) => q.id === answer.question);
        if (question && !question.allow_multiple_answers) {
            const questionAnswers = answers.filter((a) => a.question === answer.question);
            for (const a of questionAnswers) {
                if (a.id !== answerId && a.is_correct) {
                    // Здесь нужно обновить через API, но для простоты пока локально
                }
            }
        }
        // Локальное обновление (в реальном проекте нужно через API)
        setAnswers(
            answers.map((a) =>
                a.id === answerId ? { ...a, is_correct: !a.is_correct } : a
            )
        );
    };

    if (!quiz) {
        return (
            <div className="editor-loading">
                <div className="loader"></div>
                <p>Загрузка квиза...</p>
            </div>
        );
    }

    return (
        <div className="editor">
            <div className="container">
                <div className="editor-header">
                    <div className="editor-header-left">
                        <Link to="/dashboard" className="back-link">
                            ← Назад
                        </Link>
                        <div>
                            <h1>{quiz.title}</h1>
                            <p>{quiz.description || "Без описания"}</p>
                            <div className="quiz-meta-badges">
                                <span className="meta-badge category">
                                    {quiz.category || "Другое"}
                                </span>
                                <span className="meta-badge questions-badge">
                                    {questions.length} вопросов
                                </span>
                                <span className={`meta-badge status ${quiz.is_public ? "public" : "private"}`}>
                                    {quiz.is_public ? "Публичный" : "Приватный"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="play-test-btn" onClick={() => alert("Запуск квиза (WebSocket в разработке)")}>
                        ▶ Запустить
                    </button>
                </div>

                <div className="editor-grid">
                    <div className="question-list">
                        {questions.length === 0 && (
                            <div className="empty-questions">
                                <div className="empty-icon">📋</div>
                                <h3>Нет вопросов</h3>
                                <p>Добавьте первый вопрос через панель справа</p>
                            </div>
                        )}
                        {questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                answers={answers}
                                onDeleteQuestion={removeQuestion}
                                onDeleteAnswer={removeAnswer}
                                onSelectQuestion={setSelectedQuestion}
                                onToggleCorrect={toggleCorrect}
                            />
                        ))}
                    </div>

                    <div className="editor-panel">
                        <div className="panel">
                            <h2>➕ Новый вопрос</h2>
                            <form onSubmit={addQuestion}>
                                <textarea
                                    placeholder="Введите текст вопроса..."
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    rows="4"
                                />
                                <button type="submit" disabled={isAddingQuestion}>
                                    {isAddingQuestion ? "Добавление..." : "Добавить вопрос"}
                                </button>
                            </form>
                        </div>

                        {selectedQuestion && (
                            <div className="panel panel-answer">
                                <h2>✏️ Новый ответ</h2>
                                <p className="panel-subtitle">
                                    Для вопроса: {questions.find((q) => q.id === selectedQuestion)?.text?.slice(0, 40)}...
                                </p>
                                <form onSubmit={addAnswer}>
                                    <input
                                        placeholder="Введите вариант ответа..."
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                    />
                                    <button type="submit" disabled={isAddingAnswer}>
                                        {isAddingAnswer ? "Добавление..." : "Добавить ответ"}
                                    </button>
                                </form>
                                <button
                                    className="cancel-select"
                                    onClick={() => setSelectedQuestion(null)}
                                >
                                    Отменить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizEditor;