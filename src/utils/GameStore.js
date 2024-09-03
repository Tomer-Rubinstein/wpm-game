import { configureStore } from '@reduxjs/toolkit';
import gameStateSliceReducer from "./GameStateSlice.js";

export const store = configureStore({
    reducer: {
        gameState: gameStateSliceReducer,
    }
});
