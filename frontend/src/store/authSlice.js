import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    isLoggedIn : false,
    user : null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginUser:(state,action)=>{
            state.isLoggedIn = true
            state.user = action.payload
        },
        clearUser :(state)=>{
            state.user = null;
            state.isLoggedIn = false
        }
    },

})

export default authSlice.reducer;
export const {loginUser,clearUser} = authSlice.actions