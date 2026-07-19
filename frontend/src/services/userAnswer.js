import api from "./api";

export const submitAnswer = async (data) => {
    const response = await api.post("/user-answers/submit/", data);
    return response.data;
};

export const getResult = async (quizId) => {
    const response = await api.get(`/user-answers/result/?quiz_id=${quizId}`);
    return response.data;
};