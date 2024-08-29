import { CONSTANTS } from "@/context/AuthContext";

export enum API_METHODS {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE'
}
interface IHttpService {
    url: string;
    data?: Object,
    message?: string,
    method?: API_METHODS
}

export enum API_ENDPOINTS {
    LOGIN = 'login',
    VERIFY = 'verify',
    CONSIGNMENT = 'consignment'
}

const httpService = async (params: IHttpService) => {
    try {
        const { url, method = API_METHODS.GET } = params
        const apiUrl = `/api/${url}`;

        const token = localStorage.getItem(CONSTANTS.TOKEN_KEY);
        const headers: { Authorization?: string, 'Content-Type': any } = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `${token}`;
        }
        const body = params.data ? JSON.stringify(params.data) : undefined
        const response = await fetch(apiUrl, {
            method,
            headers,
            body,
        });

        if (!response?.ok) {
            throw new Error(params?.message || "An error occurred");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.message);
    }
}

export default {
    call: httpService
};