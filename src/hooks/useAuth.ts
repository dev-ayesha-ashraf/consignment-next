import { CONSTANTS, useAuthContext } from '@/context/AuthContext';
import httpService, { API_ENDPOINTS, API_METHODS } from '@/services/httpService';
import React, { useEffect, useState } from 'react';

const useAuth = () => {
    const { user, setUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onLogout = () => {
        setUser(null);
        localStorage.removeItem(CONSTANTS.TOKEN_KEY);
    };

    const onLogin = async () => {
        try {
            const data = await httpService.call({
                message: "Authentication Error",
                data: credentials,
                method: API_METHODS.POST,
                url: API_ENDPOINTS.LOGIN,
            });

            if (data?.token && data?.user) {
                const authToken = `Bearer ${data?.token}`;
                localStorage.setItem(CONSTANTS.TOKEN_KEY, authToken);
                setUser(data.user);
                setError(null); 
            } else {
                setError('Login failed. Please try again.'); 
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login. Please try again.');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem(CONSTANTS.TOKEN_KEY);
        if (token) {
            httpService.call({
                url: API_ENDPOINTS.VERIFY,
            })
            .then((response) => {
                if (response.user) {
                    setUser(response.user);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [setUser]);

    return {
        onLogin,
        onLogout,
        user,
        isLoading,
        handleChange,
        error
    };
}

export default useAuth;
