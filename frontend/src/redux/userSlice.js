import { createSlice } from '@reduxjs/toolkit'

const initialState={
    user:null,
    name:null,
    token:null,
    isAuthenticated:false 
}

const userslice=createSlice({
    name:"user",
    initialState,
    reducers:{
        loginsuccess:(state,action)=>{
            state._id=action.payload._id
            state.name=action.payload.name
            state.token=action.payload.token
            state.isAuthenticated=true
        },
        logout:(state)=>{
            state.name=null
            state.user=null
            state.token=null
            state.isAuthenticated=false
        }
    }
})

export const {loginsuccess,logout}=userslice.actions
export default userslice.reducer