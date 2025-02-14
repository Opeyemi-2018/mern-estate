import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  users: [],
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
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
    fetchMessagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
    },
    fetchMessagesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addMessage: (state, action) => {
      // Corrected reducer
      const newMessage = action.payload;
      if (!state.messages.find((msg) => msg._id === newMessage._id)) {
        return {
          ...state,
          messages: [...state.messages, newMessage],
        };
      } else {
        return state;
      }
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.messages = [];
    },
  },
});

export const {
  setSelectedUser,
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  clearSelectedUser,
} = chatSlice.actions;

export default chatSlice.reducer;
