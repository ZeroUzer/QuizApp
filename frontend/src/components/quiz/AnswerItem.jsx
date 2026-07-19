import "./AnswerItem.css";

function AnswerItem({

    answer,

    onDelete,

}) {

    return (

        <div className="answer-item">

            <div className="answer-left">

                <div className="answer-icon">

                    {

                        answer.is_correct

                        ? "✓"

                        : "•"

                    }

                </div>

                <span>

                    {answer.text}

                </span>

            </div>

            <button

                className="answer-delete"

                onClick={() =>

                    onDelete(

                        answer.id

                    )

                }

            >

                Удалить

            </button>

        </div>

    );

}

export default AnswerItem;