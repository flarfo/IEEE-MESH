import { apiSlice } from '../../app/api/apiSlice';
import { logout, setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            // provided by RTKQuery, verify that logout has occurred
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data);

                    dispatch(logout());

                    // Ensure that component is unmounted before resetting api state, should prevent continued state change subscription after logout
                    setTimeout(() => {
                        // "...manually reset the api state completely. This will immediately remove all existing cache entries, and all queries will be considered 'uninitialized'."
                        dispatch(apiSlice.util.resetApiState());
                    }, 1000);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data);
                    const { accessToken } = data;
                    dispatch(setCredentials({ accessToken }));
                }
                catch (err) {
                    console.log(err);
                }
            }
        })
    })
});

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice;