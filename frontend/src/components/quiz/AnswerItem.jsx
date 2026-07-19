import "./AnswerItem.css";

function AnswerItem({ answer, onDelete, onToggleCorrect }) {
    return (
        <div className={`answer-item ${answer.is_correct ? "correct" : ""}`}>
            <div className="answer-left">
                <button
                    className={`answer-check ${answer.is_correct ? "checked" : ""}`}
                    onClick={() => onToggleCorrect(answer.id)}
                    title={answer.is_correct ? "Сделать неправильным" : "Сделать правильным"}
                >
                    {answer.is_correct ? "✓" : "○"}
                </button>
                <span className="answer-text">{answer.text}</span>
            </div>
            <button
                className="answer-delete-btn"
                onClick={() => onDelete(answer.id)}
                title="Удалить ответ"
            >
                ✕
            </button>
        </div>
    );
}

export default AnswerItem;