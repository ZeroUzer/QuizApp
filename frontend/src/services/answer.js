import api from "./api";
import { getAccessToken } from "./auth";


const authConfig = () => {

    return {

        headers: {

            Authorization:
                `Bearer ${getAccessToken()}`

        }

    };

};





export const getAnswers = async () => {

    const response = await api.get(

        "/answers/",

        authConfig()

    );


    return response.data;

};





export const createAnswer = async (data) => {

    const response = await api.post(

        "/answers/",

        data,

        authConfig()

    );


    return response.data;

};





export const updateAnswer = async (id, data) => {

    const response = await api.patch(

        `/answers/${id}/`,

        data,

        authConfig()

    );


    return response.data;

};





export const deleteAnswer = async (id) => {

    await api.delete(

        `/answers/${id}/`,

        authConfig()

    );

};