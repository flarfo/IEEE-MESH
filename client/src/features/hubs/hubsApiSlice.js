import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const hubsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.name < b.name) ? -1 : 1
});
const initialState = hubsAdapter.getInitialState();

export const hubsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getHubs: builder.query({
            query: () => '/hubs',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedHubs = responseData.map(hub => {
                    hub.id = hub._id;
                    return hub;
                });
                return hubsAdapter.setAll(initialState, loadedHubs);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Hub', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Hub', id }))
                    ]
                }
                else return [{ type: 'Hub', id: 'LIST' }]
            }
        }),
        getHubByName: builder.query({
            query: (id) => `/hubs/byName/${id}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                responseData.id = responseData._id;
                return responseData;
            },
            providesTags: (result, error, arg) => [{ type: 'Hub', id: arg }]
        }),
        getUserHubs: builder.query({
            query: () => '/hubs/me',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            transformResponse: responseData => {
                const loadedHubs = responseData.map(hub => {
                    hub.id = hub._id;
                    return hub;
                });
                return hubsAdapter.setAll(initialState, loadedHubs);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'UserHubs', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Hub', id }))
                    ];
                }
                else return [{ type: 'UserHubs', id: 'LIST' }];
            }
        }),
        getHubById: builder.query({
            query: (id) => `/hubs/${id}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                responseData.id = responseData._id;
                return responseData;
            },
            providesTags: (result, error, arg) => [{ type: 'Hub', id: arg }]
        }),
        createNewHub: builder.mutation({
            query: initialHubData => ({
                url: `/hubs`,
                method: 'POST',
                body: {
                    ...initialHubData,
                }
            }),
            invalidatesTags: [
                { type: 'Hub', id: "LIST" }
            ]
        }),
        updateHub: builder.mutation({
            query: (initialHubData) => ({
                url: `/hubs`,
                method: 'PATCH',
                body: {
                    ...initialHubData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Hub', id: arg.id }
            ]
        }),
        deleteHub: builder.mutation({
            query: ({ id }) => ({
                url: `/hubs`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Hub', id: arg.id }
            ]
        }),
        // Check permissions, based on role determine if you receive just public members (low access) or all (admin/recruiter)
        getMembersByHubId: builder.query({
            query: (id) => `/hub/${id}/members`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedMembers = responseData.map(member => {
                    member.id = member._id;
                    return member;
                });
                return loadedMembers;
            },
            providesTags: (result) => {
                return [{ type: 'Member', id: 'LIST' }, ...result.map(member => ({ type: 'Member', id: member.id }))]
            }
        }),
        getMembershipRequestsByHubId: builder.query({
            query: (hubId) => ({
                url: `/hubs/${hubId}/requests`,
                method: 'GET',
            }),
            transformResponse: responseData => {
                const loadedRequests = responseData.map(request => {
                    request.id = request._id;
                    return request;
                });
                return loadedRequests;
            }
        }),
        createMembershipRequest: builder.mutation({
            query: (hubId) => ({
                url: `/hubs/${hubId}/requests`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'UserHubs', id: 'LIST' }
            ]
        }),

        acceptMembershipRequest: builder.mutation({
            query: ({ hubId, requestId }) => ({
                url: `/hubs/${hubId}/requests/${requestId}/accept`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Hub', id: arg.hubId },
                { type: 'UserHubs', id: 'LIST' }
            ]
        }),

        rejectMembershipRequest: builder.mutation({
            query: ({ hubId, requestId }) => ({
                url: `/hubs/${hubId}/requests/${requestId}/reject`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Hub', id: arg.hubId }
            ]
        }),
        updateUserRolesById: builder.mutation({
            query: ({ hubId, userId, role }) => ({
                url: `/hubs/${hubId}/members`,
                method: 'PATCH',
                body: { userId, role }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.userId },
                { type: 'Hub', id: arg.hubId },
            ]
        }),
        removeUserById: builder.mutation({
            query: ({ hubId, userId }) => ({
                url: `/hubs/${hubId}/members`,
                method: 'DELETE',
                body: { userId }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Hub', id: arg.hubId },
                { type: 'User', id: arg.userId },
            ]
        }),
        getEventsByHubId: builder.query({
            query: (id) => `/events/${id}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedEvents = responseData.map(event => {
                    event.id = event._id;
                    return event;
                });
                return loadedEvents;
            },
            providesTags: (result) => {
                return [{ type: 'Event', id: 'LIST' }, ...result.map(event => ({ type: 'Event', id: event.id }))]
            }
        }),
        getAnnouncementsByHubId: builder.query({
            query: (id) => `/announcements/${id}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedAnnouncements = responseData.map(announcement => {
                    announcement.id = announcement._id;
                    return announcement;
                });
                return loadedAnnouncements;
            },
            providesTags: (result) => {
                return [{ type: 'Announcement', id: 'LIST' }, ...result.map(announcement => ({ type: 'Announcement', id: announcement.id }))]
            }
        }),
        addNewRecruiter: builder.mutation({
            query: ({ hubId, initialRecruiterData }) => ({
                url: `/hubs/${hubId}/recruiters`,
                method: 'POST',
                body: {
                    ...initialRecruiterData,
                }
            })
        }),
    }),
});

export const {
    useGetHubsQuery,
    useGetHubByNameQuery,
    useGetHubByIdQuery,
    useUpdateHubMutation,
    useUpdateUserRolesByIdMutation,
    useDeleteHubMutation,
    useRemoveUserByIdMutation,
    useCreateNewHubMutation,
    useVerifyUserByIdMutation,
    useGetMembershipRequestsByHubIdQuery,
    useGetMembersByHubIdQuery,
    useGetEventsByHubIdQuery,
    useGetAnnouncementsByHubIdQuery,
    useAddNewRecruiterMutation,
} = hubsApiSlice;

// Returns the query result object
export const selectHubsResult = hubsApiSlice.endpoints.getHubs.select();

// Creates memoized selector for all hubs data
const selectHubsData = createSelector(
    selectHubsResult,
    hubsResult => hubsResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllHubs,
    selectById: selectHubById,
    selectIds: selectHubIds
} = hubsAdapter.getSelectors(state => selectHubsData(state) ?? initialState);

// Additional memoized selectors for hub name to ID mapping
export const selectHubNameToIdMap = createSelector(
    selectAllHubs,
    (hubs) => {
        return hubs.reduce((map, hub) => {
            map[hub.name] = hub.id;
            return map;
        }, {});
    }
);

// Selector to find a hub ID by name
export const selectHubIdByName = createSelector(
    [selectAllHubs, (_, name) => name],
    (hubs, name) => {
        const hub = hubs.find(hub => hub.name === name);
        return hub ? hub.id : null;
    }
);