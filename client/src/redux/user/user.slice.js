import { createSlice } from "@reduxjs/toolkit";


//initialisation
const initialState = {
    //before the login
    currentUser: null,
    error:null,
    loading:false,
};
// slice :managing a specific piece of the application state and includes the reducer function and action creators.
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            // this is the data we get from the backend as a response
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
       },
            updateUserStart: (state) => {
                state.loading = true;
                state.error = null;
        },
        updateUserSucess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signoutUserSucess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
       signoutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSucess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
       deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
         
    

  }
})
export const { signInStart, signInSuccess, signInFailure,updateUserStart,updateUserSucess,updateUserFailure,
signoutUserSucess,signoutUserFailure,signoutUserStart,
deleteUserFailure,deleteUserStart,deleteUserSucess } = userSlice.actions;
export default userSlice.reducer;