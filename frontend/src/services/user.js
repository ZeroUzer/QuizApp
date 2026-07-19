import api from "./api";
import { getAccessToken } from "./auth";


export const getProfile = async () => {

    const response = await api.get(
        "/users/profile/",
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    );

    return response.data;
};