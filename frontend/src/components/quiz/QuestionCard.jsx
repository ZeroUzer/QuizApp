import { useState } from "react";
import AnswerItem from "./AnswerItem";
import "./QuestionCard.css";

function QuestionCard({
    question,
    answers,
    onDeleteQuestion,
    onDeleteAnswer,
    onSelectQuestion,
    onToggleCorrect,
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const questionAnswers = answers.filter(
        (answer) => answer.question === question.id
    );

    const correctCount = questionAnswers.filter((a) => a.is_correct).length;

    return (
        <div className="question-card">
            <div className="question-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="question-header-left">
                    <span className="question-number">Вопрос #{question.order || 0}</span>
                    <div className="question-title-row">
                        <h3>{question.text || "Без текста"}</h3>
                        <span className="question-badge">
                            {question.allow_multiple_answers ? "Множественный" : "Одиночный"}
                        </span>
                    </div>
                    <div className="question-meta">
                        <span className="meta-item">
                            ⏱ {question.time_limit || 30} сек
                        </span>
                        <span className="meta-item">
                            📝 {questionAnswers.length} ответов
                        </span>
                        <span className={`meta-item correct-badge ${correctCount > 0 ? "has-correct" : ""}`}>
                            {correctCount > 0 ? `✅ ${correctCount} правильных` : "❌ нет правильных"}
                        </span>
                    </div>
                </div>
                <div className="question-header-right">
                    <button
                        className="delete-question-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuestion(question.id);
                        }}
                    >
                        ✕
                    </button>
                    <span className="expand-icon">{isExpanded ? "−" : "+"}</span>
                </div>
            </div>

            {isExpanded && (
                <>
                    <div className="answers-list">
                        {questionAnswers.length === 0 && (
                            <p className="empty-answer-text">
                                Нет вариантов ответа. Добавьте первый!
                            </p>
                        )}
                        {questionAnswers.map((answer) => (
                            <AnswerItem
                                key={answer.id}
                                answer={answer}
                                onDelete={onDeleteAnswer}
                                onToggleCorrect={onToggleCorrect}
                            />
                        ))}
                    </div>

                    <button
                        className="add-answer-btn"
                        onClick={() => onSelectQuestion(question.id)}
                    >
                        + Добавить вариант ответа
                    </button>
                </>
            )}
        </div>
    );
}

export default QuestionCard;