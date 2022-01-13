import { createSlice } from "@reduxjs/toolkit";
import { def } from "@vue/shared";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: window.localStorage.getItem('myblog-token') ? JSON.parse(atob(window.localStorage.getItem('myblog-token').split('.')[1])).user_id : 0,
        isAuthed: window.localStorage.getItem('myblog-token') ? true : false
    },
    reducers: {
        login: state => {
            state.isAuthed = true;
            state.userId = JSON.parse(atob(window.localStorage.getItem('myblog-token').split(".")[1])).user_id;
        },
        logout: state => {
            window.localStorage.removeItem('myblog-token');
            state.userId = 0;
            state.isAuthed = false;
        }
    }
})

export const {login, logout} = userSlice.actions
export default userSlice.reducer