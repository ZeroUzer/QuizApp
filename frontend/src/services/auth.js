import api from "./api";


export const register = async (data) => {
    const response = await api.post(
        "/users/register/",
        data
    );

    return response.data;
};


export const login = async (data) => {
    const response = await api.post(
        "/users/login/",
        data
    );

    const { access, refresh } = response.data;

    localStorage.setItem(
        "access",
        access
    );

    localStorage.setItem(
        "refresh",
        refresh
    );

    return response.data;
};


export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};


export const getAccessToken = () => {
    return localStorage.getItem("access");
};