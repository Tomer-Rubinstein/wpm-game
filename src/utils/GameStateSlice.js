import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isWin: null
};

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        setIsWin: (state, action) => {
            state.isWin = action.payload;
        }
    }
});

export const { setIsWin } = gameStateSlice.actions;

export default gameStateSlice.reducer;
