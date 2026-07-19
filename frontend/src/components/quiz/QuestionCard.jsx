import AnswerItem from "./AnswerItem";

import "./QuestionCard.css";


function QuestionCard({

    question,

    answers,

    onDeleteQuestion,

    onDeleteAnswer,

    onSelectQuestion

}) {


    const questionAnswers = answers.filter(

        (answer) =>

            answer.question === question.id

    );


    return (

        <div className="question-card">


            <div className="question-header">


                <div>


                    <span className="question-number">

                        Вопрос #{question.order}

                    </span>


                    <h2>

                        {question.text}

                    </h2>


                </div>



                <button

                    className="delete-question"

                    onClick={() =>

                        onDeleteQuestion(

                            question.id

                        )

                    }

                >

                    Удалить

                </button>


            </div>





            <div className="answers">


                {

                    questionAnswers.length === 0 && (


                        <p className="empty-answer">

                            Пока нет вариантов ответа

                        </p>


                    )

                }



                {

                    questionAnswers.map(

                        (answer) => (


                            <AnswerItem


                                key={answer.id}


                                answer={answer}


                                onDelete={onDeleteAnswer}


                            />


                        )

                    )

                }


            </div>





            <button

                className="add-answer"

                onClick={() =>

                    onSelectQuestion(

                        question.id

                    )

                }

            >

                + Добавить вариант ответа

            </button>



        </div>

    );

}


export default QuestionCard;