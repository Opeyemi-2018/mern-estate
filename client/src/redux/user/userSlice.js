import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    currentUser: null,
    error: null,
    loading: false
};

let userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // signing in
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        },

        //updating
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        }, 

        //deleting
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        },

        //signing out
        signOutUserStart: (state) => {
            state.loading = true
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export let {
    signInStart, signInSuccess, signInFailure,
    updateUserStart, updateUserSuccess, updateUserFailure,
    deleteUserStart, deleteUserSuccess, deleteUserFailure,
    signOutUserStart, signOutUserSuccess, signOutUserFailure
} = userSlice.actions

export default userSlice.reducer