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
         
    

  }
})
export const { signInStart, signInSuccess, signInFailure,updateUserStart,updateUserSucess,updateUserFailure } = userSlice.actions;
export default userSlice.reducer;