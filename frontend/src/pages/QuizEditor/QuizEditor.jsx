import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getQuiz } from "../../services/quiz";
import { createQuestion, deleteQuestion } from "../../services/question";
import { getAnswers, createAnswer, updateAnswer, deleteAnswer } from "../../services/answer";
import "./QuizEditor.css";

function QuizEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionText, setQuestionText] = useState("");
    const [answerText, setAnswerText] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isAddingAnswer, setIsAddingAnswer] = useState(false);

    useEffect(() => {
        load();
    }, [id]);

    const load = async () => {
        try {
            const quizData = await getQuiz(id);
            setQuiz(quizData);
            setQuestions(quizData.questions || []);
            
            const answersData = await getAnswers();
            setAnswers(answersData);
        } catch (error) {
            console.error("Ошибка загрузки:", error);
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const getQuestionAnswers = (questionId) => {
        return answers.filter((a) => a.question === questionId);
    };

    const addQuestion = async (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;
        setIsAddingQuestion(true);
        try {
            const question = await createQuestion({
                quiz: id,
                text: questionText,
                order: questions.length + 1,
            });
            setQuestions([...questions, question]);
            setQuestionText("");
        } catch (error) {
            alert("Ошибка создания вопроса");
        } finally {
            setIsAddingQuestion(false);
        }
    };

    const addAnswer = async (e) => {
        e.preventDefault();
        if (!selectedQuestion || !answerText.trim()) return;
        setIsAddingAnswer(true);
        try {
            const answer = await createAnswer({
                question: selectedQuestion,
                text: answerText,
                is_correct: false,
            });
            const answerWithQuestion = { ...answer, question: selectedQuestion };
            setAnswers([...answers, answerWithQuestion]);
            setAnswerText("");
        } catch (error) {
            alert("Ошибка создания ответа");
        } finally {
            setIsAddingAnswer(false);
        }
    };

    const toggleCorrect = async (answerId) => {
        const answer = answers.find(a => a.id === answerId);
        if (!answer) return;
        
        const newValue = !answer.is_correct;
        
        // Сначала обновляем локально для быстрого отклика
        setAnswers(
            answers.map((a) =>
                a.id === answerId ? { ...a, is_correct: newValue } : a
            )
        );
        
        // Отправляем запрос на сервер
        try {
            await updateAnswer(answerId, { is_correct: newValue });
        } catch (error) {
            // Если ошибка — откатываем
            setAnswers(
                answers.map((a) =>
                    a.id === answerId ? { ...a, is_correct: !newValue } : a
                )
            );
            alert("Ошибка сохранения");
        }
    };

    const removeQuestion = async (questionId) => {
        if (!window.confirm("Удалить этот вопрос?")) return;
        try {
            await deleteQuestion(questionId);
            setQuestions(questions.filter((q) => q.id !== questionId));
            setAnswers(answers.filter((a) => a.question !== questionId));
            if (selectedQuestion === questionId) setSelectedQuestion(null);
        } catch {
            alert("Ошибка удаления");
        }
    };

    const removeAnswer = async (answerId) => {
        if (!window.confirm("Удалить этот ответ?")) return;
        try {
            await deleteAnswer(answerId);
            setAnswers(answers.filter((a) => a.id !== answerId));
        } catch {
            alert("Ошибка удаления");
        }
    };

    if (loading) {
        return (
            <div className="editor-loading">
                <div className="loader"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="editor">
            <div className="container">
                <div className="editor-header">
                    <div>
                        <Link to="/dashboard" className="back-link">← Назад</Link>
                        <h1>{quiz?.title}</h1>
                        <p className="editor-desc">{quiz?.description || "Без описания"}</p>
                    </div>
                    <div className="editor-stats">
                        <span>{questions.length} вопросов</span>
                    </div>
                </div>

                <div className="editor-grid">
                    <div className="question-list">
                        {questions.length === 0 && (
                            <div className="empty-questions">
                                <p>Нет вопросов. Добавьте первый!</p>
                            </div>
                        )}
                        {questions.map((question) => {
                            const questionAnswers = getQuestionAnswers(question.id);
                            return (
                                <div className="question-card" key={question.id}>
                                    <div className="question-header">
                                        <div>
                                            <span className="question-order">#{question.order}</span>
                                            <h3>{question.text}</h3>
                                        </div>
                                        <button
                                            className="delete-question-btn"
                                            onClick={() => removeQuestion(question.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="answers-list">
                                        {questionAnswers.length === 0 && (
                                            <p className="empty-answers">Нет вариантов ответа</p>
                                        )}
                                        {questionAnswers.map((answer) => (
                                            <div
                                                className={`answer-item ${answer.is_correct ? "correct" : ""}`}
                                                key={answer.id}
                                            >
                                                <span>{answer.text}</span>
                                                <div className="answer-actions">
                                                    <button
                                                        className={`toggle-correct ${answer.is_correct ? "is-correct" : ""}`}
                                                        onClick={() => toggleCorrect(answer.id)}
                                                    >
                                                        {answer.is_correct ? "✓" : "○"}
                                                    </button>
                                                    <button
                                                        className="delete-answer-btn"
                                                        onClick={() => removeAnswer(answer.id)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            className="add-answer-btn"
                                            onClick={() => setSelectedQuestion(question.id)}
                                        >
                                            + Добавить ответ
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="editor-panel">
                        <div className="panel">
                            <h2>Новый вопрос</h2>
                            <form onSubmit={addQuestion}>
                                <textarea
                                    placeholder="Текст вопроса..."
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    rows="3"
                                />
                                <button type="submit" disabled={isAddingQuestion}>
                                    {isAddingQuestion ? "Добавление..." : "Добавить вопрос"}
                                </button>
                            </form>
                        </div>

                        {selectedQuestion && (
                            <div className="panel panel-answer">
                                <h2>Новый ответ</h2>
                                <p className="panel-subtitle">
                                    Для вопроса #{questions.find(q => q.id === selectedQuestion)?.order}
                                </p>
                                <form onSubmit={addAnswer}>
                                    <input
                                        placeholder="Вариант ответа..."
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                    />
                                    <button type="submit" disabled={isAddingAnswer}>
                                        {isAddingAnswer ? "Добавление..." : "Добавить ответ"}
                                    </button>
                                </form>
                                <button
                                    className="cancel-btn"
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