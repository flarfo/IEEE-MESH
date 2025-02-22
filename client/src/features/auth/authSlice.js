import { createSlice } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: {
        setCredentials: (state, action) => {
            // get access token from login payload
            const { accessToken } = action.payload;
            state.token = accessToken;
        },
        logout: (state, action) => {
            // nullify access token on logout
            state.token = null;
            window.location.reload();
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state) => state.auth.token;