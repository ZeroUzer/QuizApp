import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getQuiz } from "../../services/quiz";
import { submitAnswer, getResult } from "../../services/userAnswer";
import "./QuizPlay.css";

function QuizPlay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCorrect, setShowCorrect] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, [id]);

    useEffect(() => {
        if (!questions.length || isAnswered) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentIndex, questions, isAnswered]);

    const loadQuiz = async () => {
        try {
            const data = await getQuiz(id);
            setQuiz(data);
            setQuestions(data.questions || []);
            if (data.time_limit) setTimeLeft(data.time_limit);
        } catch {
            setError("Ошибка загрузки квиза");
        } finally {
            setLoading(false);
        }
    };

    const handleTimeout = async () => {
        if (isAnswered) return;
        setIsAnswered(true);
        setShowCorrect(true);
        const question = questions[currentIndex];
        await submitAnswer({
            question_id: question.id,
            option_id: null,
        });
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedOption(null);
                setIsAnswered(false);
                setShowCorrect(false);
                setTimeLeft(quiz?.time_limit || 30);
            } else {
                loadResult();
            }
        }, 1500);
    };

    const handleSelect = async (optionId) => {
        if (isAnswered) return;
        setSelectedOption(optionId);
        setIsAnswered(true);
        setShowCorrect(true);
        const question = questions[currentIndex];
        await submitAnswer({
            question_id: question.id,
            option_id: optionId,
        });
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedOption(null);
                setIsAnswered(false);
                setShowCorrect(false);
                setTimeLeft(quiz?.time_limit || 30);
            } else {
                loadResult();
            }
        }, 1500);
    };

    const loadResult = async () => {
        try {
            const data = await getResult(id);
            setResult(data);
        } catch {
            setError("Ошибка получения результата");
        }
    };

    if (loading) {
        return (
            <div className="play-loading">
                <div className="loader"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="play-error">
                <p>{error}</p>
                <Link to="/">На главную</Link>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="play-error">
                <p>В этом квизе нет вопросов</p>
                <Link to="/">На главную</Link>
            </div>
        );
    }

    if (result !== null) {
        return (
            <div className="play-result">
                <div className="result-card">
                    <h1>Результат</h1>
                    <div className="result-score">
                        <span className="score-number">{result.correct}</span>
                        <span className="score-total">/{result.total}</span>
                    </div>
                    <p className="result-percent">{result.percent}%</p>
                    <div className="result-bar">
                        <div className="result-bar-fill" style={{ width: `${result.percent}%` }}></div>
                    </div>
                    <div className="result-actions">
                        <Link to="/" className="result-home">На главную</Link>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentIndex];
    const options = question?.options || [];

    return (
        <div className="play-page">
            <div className="play-container">
                <div className="play-header">
                    <div className="play-progress">
                        <span className="progress-text">
                            Вопрос {currentIndex + 1} из {questions.length}
                        </span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className={`play-timer ${timeLeft <= 5 ? "danger" : ""}`}>
                        ⏱ {timeLeft}с
                    </div>
                </div>

                <div className="play-question">
                    <h2>{question?.text || "Вопрос без текста"}</h2>
                </div>

                <div className="play-options">
                    {options.map((option) => {
                        let className = "play-option";
                        if (selectedOption === option.id) {
                            className += " selected";
                        }
                        if (showCorrect && option.is_correct) {
                            className += " correct";
                        }
                        if (showCorrect && selectedOption === option.id && !option.is_correct) {
                            className += " wrong";
                        }
                        return (
                            <button
                                key={option.id}
                                className={className}
                                onClick={() => handleSelect(option.id)}
                                disabled={isAnswered}
                            >
                                <span className="option-marker">
                                    {selectedOption === option.id ? "✓" : "○"}
                                </span>
                                <span className="option-text">{option.text}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="play-footer">
                    <span className="play-hint">
                        {isAnswered ? "Ожидание следующего вопроса..." : "Выберите вариант ответа"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default QuizPlay;