import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const daySlice = createSlice({
    name: "weather",
    initialState: {
        daysWeather: [],
        weatherNow: {},
    },
    reducers: {
        weather(state, action) {
            state.daysWeather = action.payload.listDays
        },
        weatherNow(state, action) {
            state.weatherNow = action.payload.cityData
        }
    }
})

export const weatherOnDays = async (dispatch, city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ea2e638e299558709181a842b8507203`
    axios({
        method: 'get',
        url: url
    })
        .then(function (response) {

            function tempMaxMin(date) {
                const allDay = response.data.list.filter((elem) => {
                    return (new Date(elem.dt_txt).toDateString() === new Date(date).toDateString())
                })
                const tempMin = Math.round(allDay.map(element => element.main.temp_min).reduce((prev, cur) => Math.min(prev, cur), 1000) - 273) + ' ' + '℃'
                const tempMax = Math.round(allDay.map(element => element.main.temp_max).reduce((prev, cur) => Math.max(prev, cur), 0) - 273) + ' ' + '℃'
                return { tempMin, tempMax }
            }
            const listDays = response.data.list.filter((elem) => {
                const date = new Date(elem.dt_txt)
                return (date.toDateString() !== new Date().toDateString() && date.getHours() === 12)
            })
                .slice(0, 5)
                .map(e => {

                    const date = new Date(e.dt_txt)
                    tempMaxMin(date)
                    const days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sut']
                    const day = date.getDay()
                    const temp = tempMaxMin(date)
                    return {
                        day: days[day],
                        icon: `https://openweathermap.org/img/wn/${e.weather[0].icon}.png`,
                        tempMin: temp.tempMin,
                        tempMax: temp.tempMax,
                        key: e.dt
                    }
                })

            dispatch(weather({ listDays }))

            const date = new Date(response.data.list[0].dt_txt).toDateString()
            const temp = tempMaxMin(date)
            const iconId = response.data.list[0].weather[0].icon
            const cityData = {
                date: date,
                city: response.data.city.name,
                country: response.data.city.country,
                description: response.data.list[0].weather[0].description,
                icon: `https://openweathermap.org/img/wn/${iconId}@2x.png`,
                main: Math.round(response.data.list[0].main.temp - 273),
                tempMax: temp.tempMax,
                tempMin: temp.tempMin
            }
            dispatch(weatherNow({ cityData }))

            console.log(response)
        })
}
export const { weather, weatherNow } = daySlice.actions
export default daySlice.reducer