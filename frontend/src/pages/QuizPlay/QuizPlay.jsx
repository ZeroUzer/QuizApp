import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getQuiz } from "../../services/quiz";



function QuizPlay() {


    const { id } = useParams();



    const [quiz, setQuiz] = useState(null);

    const [answers, setAnswers] = useState({});

    const [result, setResult] = useState(null);

    const [error, setError] = useState("");





    useEffect(() => {

        loadQuiz();

    }, []);





    const loadQuiz = async () => {

        try {

            const data =
                await getQuiz(id);


            setQuiz(data);


        } catch (error) {

            console.log(error);

            setError(
                "Ошибка загрузки квиза"
            );

        }

    };







    const handleSelectAnswer = (
        questionId,
        answerId
    ) => {


        setAnswers({

            ...answers,

            [questionId]: answerId

        });


    };








    const handleFinish = () => {


        let score = 0;



        quiz.questions.forEach(

            (question) => {


                const selected =
                    answers[question.id];



                const correct =
                    question.options.find(

                        (answer) =>
                            answer.is_correct

                    );



                if (

                    correct &&

                    selected === correct.id

                ) {

                    score++;

                }


            }

        );



        setResult(score);


    };








    if (!quiz) {


        return (

            <div>

                Загрузка...

            </div>

        );

    }








    return (

        <div>


            <h1>

                {quiz.title}

            </h1>



            <p>

                {quiz.description}

            </p>




            <hr />







            {
                quiz.questions.map(

                    (question) => (


                        <div

                            key={
                                question.id
                            }

                        >



                            <h2>

                                {question.text}

                            </h2>





                            {
                                question.options.map(

                                    (option) => (



                                        <div

                                            key={
                                                option.id
                                            }

                                        >



                                            <label>


                                                <input


                                                    type="radio"


                                                    name={
                                                        question.id
                                                    }



                                                    checked={

                                                        answers[
                                                            question.id
                                                        ]
                                                        ===
                                                        option.id

                                                    }



                                                    onChange={() =>

                                                        handleSelectAnswer(

                                                            question.id,

                                                            option.id

                                                        )

                                                    }



                                                />



                                                {option.text}


                                            </label>


                                        </div>


                                    )

                                )

                            }



                        </div>


                    )

                )

            }








            <button

                onClick={
                    handleFinish
                }

            >

                Завершить


            </button>








            {
                result !== null &&


                <h2>

                    Результат:

                    {" "}

                    {result}

                    /

                    {quiz.questions.length}


                </h2>

            }






            {
                error &&

                <p>

                    {error}

                </p>

            }





        </div>

    );

}



export default QuizPlay;