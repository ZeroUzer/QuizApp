import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/users/profile/");
    return response.data;
};