import api from "./api";

export const getQuizzes = async () => {
    const response = await api.get("/quizzes/");
    return response.data;
};

export const getMyQuizzes = async () => {
    const response = await api.get("/quizzes/my/");
    return response.data;
};

export const getQuiz = async (id) => {
    const response = await api.get(`/quizzes/${id}/`);
    return response.data;
};

export const createQuiz = async (data) => {
    const response = await api.post("/quizzes/", data);
    return response.data;
};

export const updateQuiz = async (id, data) => {
    const response = await api.put(`/quizzes/${id}/`, data);
    return response.data;
};

export const deleteQuiz = async (id) => {
    await api.delete(`/quizzes/${id}/`);
};