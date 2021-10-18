/* eslint-disable no-throw-literal */

import * as Config from "../config";
import { APIError } from "../errors/APIError";
import { authStore, ICredentials } from "../stores/AuthStore";

export const STATUS_CODE_UNAUTHORIZED = 401;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.credentials && authStore.credentials.access_token}`,
});

const handleUnauthorizedError = (error: APIError) => {
    if (error.statusCode && error.statusCode === STATUS_CODE_UNAUTHORIZED) {
        authStore.logout();
    }
};

export const API = {
    async loginWithPassword(options: { username: string; password: string }): Promise<ICredentials> {
        try {
            const response = await fetch(`${Config.API_BASE_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: options.username,
                    password: options.password,
                    scope: "cms",
                }),
            });

            if (!response.ok) {
                throw new APIError(response.status, response.statusText);
            }

            return response.json();
        } catch (error) {
            if (error instanceof APIError) {
                handleUnauthorizedError(error);
            }
            throw error;
        }
    },
};
