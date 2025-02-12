import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  users: [], // You might use this later for a list of users
  selectedUser: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = []; // Clear messages when selecting a new user
      state.loading = false; // Reset loading state
      state.error = null; // Reset error state
    },
    fetchMessagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action) => {
      state.messages = action.payload; // No need for the Array.isArray check here
      state.loading = false;
    },
    fetchMessagesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addMessage: (state, action) => {
      const newMessage = action.payload;
      if (!state.messages.find((msg) => msg._id === newMessage._id)) {
        state.messages.push(newMessage);
      }
    },
    clearSelectedUser: (state) => {
      // Add a reducer to clear the selected user
      state.selectedUser = null;
      state.messages = []; // Optionally clear messages as well
    },
  },
});

export const {
  setSelectedUser,
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  clearSelectedUser, // Export the new action
} = chatSlice.actions;

export default chatSlice.reducer;
