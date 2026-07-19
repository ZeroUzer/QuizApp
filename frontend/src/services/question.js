import api from "./api";

export const getQuestions = async () => {
    const response = await api.get("/questions/");
    return response.data;
};

export const createQuestion = async (data) => {
    const response = await api.post("/questions/", data);
    return response.data;
};

export const deleteQuestion = async (id) => {
    await api.delete(`/questions/${id}/`);
};