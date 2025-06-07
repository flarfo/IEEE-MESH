import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

// Applies to every request sent
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500', // DEV URL
    credentials: 'include', // Send secure cookie with refresh token
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // if Forbidden, try to get new access token
    if (result?.error?.status === 403) {
        console.log('Sending refresh token...');

        // Send refresh token to get a new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        if (refreshResult?.data) {
            // Store new token (if returned)
            api.dispatch(setCredentials({ ...refreshResult.data }));

            // Retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
        }
        else {
            // if still Forbidden, then login has expired
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired.';
            }

            return refreshResult;
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Member', 'User', 'Hub'],
    endpoints: builder => ({})
});