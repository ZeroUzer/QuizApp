import api from "./api";

export const getAnswers = async () => {
    const response = await api.get("/answers/");
    return response.data;
};

export const createAnswer = async (data) => {
    const response = await api.post("/answers/", data);
    return response.data;
};

export const updateAnswer = async (id, data) => {
    const response = await api.patch(`/answers/${id}/`, data);
    return response.data;
};

export const deleteAnswer = async (id) => {
    await api.delete(`/answers/${id}/`);
};