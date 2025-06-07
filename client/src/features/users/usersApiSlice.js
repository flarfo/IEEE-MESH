import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // GLOBAL ADMIN ENDPOINTS
        getAllUsers: builder.query({
            query: () => `/users`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id;
                    return user;
                });
                return usersAdapter.setAll(initialState, loadedUsers);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ];
                } 
                else return [{ type: 'User', id: 'LIST' }];
            }
        }),
        // PUBLIC ENDPOINTS
        registerUser: builder.mutation({
            query: userData => ({
                url: '/users/register',
                method: 'POST',
                body: {
                    ...userData
                }
            })
        }),
        // ADMIN/CURRENT USER ENDPOINTS
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id },
                { type: 'User', id: 'LIST' }
            ]
        }),
        updateUser: builder.mutation({
            query: userData => ({
                url: `/users/${userData.id}`,
                method: 'PATCH',
                body: {
                    ...userData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        changePassword: builder.mutation({
            query: passwordData => ({
                url: `/users/${passwordData.id}/password`,
                method: 'POST',
                body: {
                    ...passwordData
                }
            })
        }),
        // USER LOOKUP
        getUserById: builder.query({
            query: id => `/users/${id}`,
            transformResponse: userData => {
                if (userData) {
                    userData.id = userData._id || userData.id;
                }
                return userData;
            },
            providesTags: (result, error, arg) => [{ type: 'User', id: arg }]
        }),
        getCurrentUser: builder.query({
            query: id => `/users/${id}`,
            transformResponse: userData => {
                if (userData) {
                    userData.id = userData._id || userData.id;
                }
                return userData;
            },
            providesTags: (result, error, arg) => [{ type: 'CurrentUser', id: arg }]
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useRegisterUserMutation,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useGetUserByIdQuery,
} = usersApiSlice;

// Selectors
export const selectUsersResult = usersApiSlice.endpoints.getAllUsers.select();

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
);

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);

// Additional selectors for current user
export const selectCurrentUser = createSelector(
    apiSlice.endpoints.getCurrentUser.select(),
    currentUserResult => currentUserResult.data
);