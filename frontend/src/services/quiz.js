import api from "./api";
import { getAccessToken } from "./auth";


const authConfig = () => ({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`
    }
});


export const getQuizzes = async () => {

    const response = await api.get(
        "/quizzes/",
        authConfig()
    );

    return response.data;
};


export const getMyQuizzes = async () => {

    const response = await api.get(
        "/quizzes/my/",
        authConfig()
    );

    return response.data;
};


export const getQuiz = async (id) => {

    const response = await api.get(
        `/quizzes/${id}/`,
        authConfig()
    );

    return response.data;
};


export const createQuiz = async (data) => {

    const response = await api.post(
        "/quizzes/",
        data,
        authConfig()
    );

    return response.data;
};


export const updateQuiz = async (id, data) => {

    const response = await api.put(
        `/quizzes/${id}/`,
        data,
        authConfig()
    );

    return response.data;
};


export const deleteQuiz = async (id) => {

    await api.delete(
        `/quizzes/${id}/`,
        authConfig()
    );

};