import api from "./api";
import { getAccessToken } from "./auth";


const authConfig = () => {
    return {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    };
};



export const getQuestions = async () => {

    const response = await api.get(
        "/questions/",
        authConfig()
    );

    return response.data;
};



export const createQuestion = async (data) => {

    const response = await api.post(
        "/questions/",
        data,
        authConfig()
    );

    return response.data;
};



export const deleteQuestion = async (id) => {

    await api.delete(
        `/questions/${id}/`,
        authConfig()
    );

};