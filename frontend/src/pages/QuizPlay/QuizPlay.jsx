import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getQuiz } from "../../services/quiz";
import "./QuizPlay.css";

function QuizPlay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isAnswered, setIsAnswered] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadQuiz();
    }, [id]);

    useEffect(() => {
        if (!quiz) return;
        const questions = quiz.questions || [];
        if (currentQuestion >= questions.length) return;
        const timeLimit = questions[currentQuestion]?.time_limit || 30;
        setTimeLeft(timeLimit);
        setIsAnswered(false);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleNext();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, quiz]);

    const loadQuiz = async () => {
        try {
            const data = await getQuiz(id);
            setQuiz(data);
        } catch {
            setError("Ошибка загрузки квиза");
        }
    };

    const handleSelectAnswer = (questionId, answerId) => {
        if (isAnswered) return;
        const question = quiz.questions.find((q) => q.id === questionId);
        if (question?.allow_multiple_answers) {
            const current = answers[questionId] || [];
            const updated = current.includes(answerId)
                ? current.filter((id) => id !== answerId)
                : [...current, answerId];
            setAnswers({ ...answers, [questionId]: updated });
        } else {
            setAnswers({ ...answers, [questionId]: answerId });
        }
    };

    const handleNext = () => {
        const questions = quiz?.questions || [];
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        let score = 0;
        let total = 0;
        (quiz?.questions || []).forEach((question) => {
            total++;
            const selected = answers[question.id];
            const correctOptions = question.options.filter((opt) => opt.is_correct);
            const correctIds = correctOptions.map((opt) => opt.id);

            if (question.allow_multiple_answers) {
                const selectedArr = selected || [];
                const allCorrect = correctIds.every((id) => selectedArr.includes(id));
                const noExtra = selectedArr.every((id) => correctIds.includes(id));
                if (allCorrect && noExtra && selectedArr.length > 0) {
                    score++;
                }
            } else {
                if (selected === correctIds[0]) {
                    score++;
                }
            }
        });
        setResult(score);
        setShowResult(true);
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setResult(null);
        setShowResult(false);
        setTimeLeft(30);
        setIsAnswered(false);
    };

    if (error) {
        return (
            <div className="play-error">
                <div className="play-error-icon">😕</div>
                <h2>{error}</h2>
                <Link to="/">Вернуться на главную</Link>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="play-loading">
                <div className="loader"></div>
                <p>Загрузка квиза...</p>
            </div>
        );
    }

    const questions = quiz.questions || [];
    const totalQuestions = questions.length;

    if (totalQuestions === 0) {
        return (
            <div className="play-error">
                <div className="play-error-icon">📭</div>
                <h2>В этом квизе нет вопросов</h2>
                <Link to="/">Вернуться на главную</Link>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((result / totalQuestions) * 100);
        let emoji = "😐";
        let grade = "Нужно больше практики!";
        if (percentage >= 90) { emoji = "🏆"; grade = "Гениально!"; }
        else if (percentage >= 70) { emoji = "🌟"; grade = "Отлично!"; }
        else if (percentage >= 50) { emoji = "👍"; grade = "Неплохо!"; }
        else if (percentage >= 30) { emoji = "📖"; grade = "Учись больше!"; }

        return (
            <div className="play-result">
                <div className="result-card">
                    <div className="result-emoji">{emoji}</div>
                    <h1>Результат</h1>
                    <div className="result-score">
                        <span className="score-number">{result}</span>
                        <span className="score-total">/{totalQuestions}</span>
                    </div>
                    <div className="result-bar">
                        <div className="result-bar-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="result-grade">{grade}</p>
                    <p className="result-percent">{percentage}%</p>
                    <div className="result-actions">
                        <button className="result-restart" onClick={restartQuiz}>
                            Пройти ещё раз
                        </button>
                        <Link to="/" className="result-home">
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const selected = answers[question.id] || (question.allow_multiple_answers ? [] : null);
    const isMultiple = question.allow_multiple_answers;

    return (
        <div className="play-page">
            <div className="play-container">
                <div className="play-header">
                    <div className="play-progress">
                        <span className="progress-text">
                            Вопрос {currentQuestion + 1} из {totalQuestions}
                        </span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className={`play-timer ${timeLeft <= 5 ? "danger" : ""}`}>
                        ⏱ {timeLeft}с
                    </div>
                </div>

                <div className="play-question">
                    <h2>{question.text || "Вопрос без текста"}</h2>
                    {question.image && (
                        <img src={question.image} alt="Вопрос" className="question-image" />
                    )}
                    {isMultiple && (
                        <p className="play-hint">Выберите все правильные ответы</p>
                    )}
                </div>

                <div className="play-options">
                    {question.options.map((option) => {
                        const isSelected = isMultiple
                            ? (selected || []).includes(option.id)
                            : selected === option.id;
                        return (
                            <button
                                key={option.id}
                                className={`play-option ${isSelected ? "selected" : ""}`}
                                onClick={() => handleSelectAnswer(question.id, option.id)}
                                disabled={isAnswered}
                            >
                                <span className="option-marker">
                                    {isSelected ? "✓" : "○"}
                                </span>
                                <span className="option-text">{option.text}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="play-footer">
                    <button
                        className="play-next"
                        onClick={handleNext}
                        disabled={!selected || (isMultiple && selected.length === 0)}
                    >
                        {currentQuestion === totalQuestions - 1 ? "Завершить" : "Дальше →"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPlay;