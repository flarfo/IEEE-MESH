import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const profilesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.name < b.name) ? -1 : 1
});
const initialState = profilesAdapter.getInitialState();

export const profilesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllProfiles: builder.query({
            query: () => '/profiles',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedProfiles = responseData.map(profile => {
                    profile.id = profile._id;

                    return profile;
                });

                return profilesAdapter.setAll(initialState, loadedProfiles);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Profile', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Profile', id }))
                    ]
                } 
                else return [{ type: 'Profile', id: 'LIST' }]
            }
        }),
        getProfileByUsername: builder.query({
            query: (username) => `/users/${username}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                responseData.id = responseData._id;

                return responseData;
            }
        }),
        updateProfile: builder.mutation({
            query: initialProfileData => ({
                url: '/profiles',
                method: 'PATCH',
                body: {
                    ...initialProfileData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Profile', id: arg.id }
            ]
        })
    }),
});

export const {
    useGetAllProfilesQuery,
    useGetProfileByUsernameQuery,
    useUpdateProfileMutation,
} = profilesApiSlice;

// returns the query result object
export const selectProfilesResult = profilesApiSlice.endpoints.getProfiles.select()

// creates memoized selector
const selectProfilesData = createSelector(
    selectProfilesResult,
    profilesResult => profilesResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProfiles,
    selectById: selectProfileById,
    selectIds: selectProfileIds
    // Pass in a selector that returns the profiles slice of state
} = profilesAdapter.getSelectors(state => selectProfilesData(state) ?? initialState);