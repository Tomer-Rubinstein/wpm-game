import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isWin: null,
    accuracy: null
};

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        setIsWin: (state, action) => {
            state.isWin = action.payload;
        },
        setAccuracy: (state, action) => {
            state.accuracy = action.payload;
        }
    }
});

export const { setIsWin, setAccuracy } = gameStateSlice.actions;

export default gameStateSlice.reducer;
