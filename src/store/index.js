import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./daySlice"

export default configureStore({
    reducer: {
        daysWeather: weatherReducer,
    },
});