import { createSlice } from '@reduxjs/toolkit';

const hubsSlice = createSlice({
  name: 'hubs',
  initialState: {
    currentHubId: null,
    activeTab: 'overview' // For navigation within a hub (overview, members, events, etc.)
  },
  reducers: {
    setCurrentHub: (state, action) => {
      state.currentHubId = action.payload;
    },
    clearCurrentHub: (state) => {
      state.currentHubId = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    }
  }
});

export const { setCurrentHub, clearCurrentHub, setActiveTab } = hubsSlice.actions;
export default hubsSlice.reducer;