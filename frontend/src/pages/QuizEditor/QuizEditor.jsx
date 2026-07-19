import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import QuestionCard from "../../components/quiz/QuestionCard";

import {
    getQuiz,
} from "../../services/quiz";

import {
    createQuestion,
    deleteQuestion,
} from "../../services/question";

import {
    getAnswers,
    createAnswer,
    deleteAnswer,
} from "../../services/answer";

import "./QuizEditor.css";

function QuizEditor() {

    const { id } = useParams();

    const [quiz, setQuiz] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState([]);

    const [questionText, setQuestionText] = useState("");

    const [answerText, setAnswerText] = useState("");

    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {

        load();

    }, []);

    const load = async () => {

        const quizData = await getQuiz(id);

        setQuiz(quizData);

        setQuestions(quizData.questions || []);

        const answerData = await getAnswers();

        setAnswers(answerData);

    };

    const addQuestion = async (e) => {

        e.preventDefault();

        if (!questionText.trim()) {

            return;

        }

        const question = await createQuestion({

            quiz: id,

            text: questionText,

            allow_multiple_answers: false,

            time_limit: 30,

            order: questions.length + 1,

        });

        setQuestions([

            ...questions,

            question,

        ]);

        setQuestionText("");

    };

    const addAnswer = async (e) => {

        e.preventDefault();

        if (!selectedQuestion) {

            return;

        }

        if (!answerText.trim()) {

            return;

        }

        const answer = await createAnswer({

            question: selectedQuestion,

            text: answerText,

            is_correct: false,

        });

        setAnswers([

            ...answers,

            answer,

        ]);

        setAnswerText("");

    };

    const removeQuestion = async (questionId) => {

        await deleteQuestion(questionId);

        setQuestions(

            questions.filter(

                q => q.id !== questionId

            )

        );

        setAnswers(

            answers.filter(

                a => a.question !== questionId

            )

        );

    };

    const removeAnswer = async (answerId) => {

        await deleteAnswer(answerId);

        setAnswers(

            answers.filter(

                a => a.id !== answerId

            )

        );

    };

    if (!quiz) {

        return <h2>Загрузка...</h2>;

    }

    return (

        <div className="editor">

            <div className="container">

                <div className="editor-header">

                    <div>

                        <h1>

                            {quiz.title}

                        </h1>

                        <p>

                            {quiz.description}

                        </p>

                    </div>

                </div>

                <div className="editor-grid">

                    <div className="question-list">

                        {

                            questions.map((question) => (

                                <QuestionCard

                                    key={question.id}

                                    question={question}

                                    answers={answers}

                                    onDeleteQuestion={removeQuestion}

                                    onDeleteAnswer={removeAnswer}

                                    onSelectQuestion={setSelectedQuestion}

                                />

                            ))

                        }

                    </div>

                    <div className="editor-panel">

                        <div className="panel">

                            <h2>

                                Новый вопрос

                            </h2>

                            <form onSubmit={addQuestion}>

                                <textarea

                                    placeholder="Введите вопрос"

                                    value={questionText}

                                    onChange={(e)=>

                                        setQuestionText(e.target.value)

                                    }

                                />

                                <button>

                                    Добавить вопрос

                                </button>

                            </form>

                        </div>

                        {

                            selectedQuestion && (

                                <div className="panel">

                                    <h2>

                                        Новый ответ

                                    </h2>

                                    <form onSubmit={addAnswer}>

                                        <input

                                            placeholder="Введите вариант ответа"

                                            value={answerText}

                                            onChange={(e)=>

                                                setAnswerText(e.target.value)

                                            }

                                        />

                                        <button>

                                            Добавить ответ

                                        </button>

                                    </form>

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default QuizEditor;