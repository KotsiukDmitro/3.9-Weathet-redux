import './App.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { weatherOnDays } from './store/daySlice';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Autosuggest from 'react-autosuggest'
import axios from "axios"
import { useCallback } from 'react';

function App() {

  const [city, setCity] = useState('Zaporizhzhia')
  function searchCity(event) {
    setCity(event.target.value)
  }
  const dispatch = useDispatch()
  const weatherOnDay = useSelector(state => state.daysWeather.daysWeather)
  const weatherNow = useSelector(state => state.daysWeather.weatherNow)

  const [citySearch, setCitySearch] = useState([])


  // const handleOnSelect = useCallback((item) => {
  //   setCity(item.name)
  //   submit()
  // }, [dispatch])


  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    axios({
      method: 'get',
      url: `https://api.api-ninjas.com/v1/city?name= ${inputValue}&limit=30&country=UA`,
      headers: { 'X-Api-Key': 'EOzrrsGSWJWRfdSI6dp8LA==Jcbym0OqpNWAIB7f' }
    })
      .then(function (response) {
        const list = response.data.map(item => {
          return {
            id: item.name,
            name: item.name
          }
        })
        setCitySearch(list)
        console.log(response)
      })
  }
  const getSuggestionValue = suggestion => suggestion.name
  // weatherOnDays(dispatch, city)


  const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  )
  const [value, setValue] = useState('Zaporizhzhia')

  const onChange = (event, { newValue }) => {
    setValue(newValue)
  }
  const onSuggestionsFetchRequested = ({ value }) => {
    console.log(value);
    setCity(getSuggestions(value))
    weatherOnDays(dispatch, value)

  }
  const onSuggestionsClearRequested = () => {
    setCitySearch([])
  }
  const inputProps = {
    value: value,
    onChange
  }

  useEffect(() => {
    weatherOnDays(dispatch, city);
  }, [dispatch]);

  return (<>
    <div className='container'>
      <div className='widget'>
        <div>
          <div className='city'>{weatherNow.city}, {weatherNow.country}</div>
          <img className='img' alt='img' src={weatherNow.icon} />
          <div className='description'>{weatherNow.description}</div>
        </div>
        <div className='weather'>
          <div className='temp'>
            <span className='temp-now'>{weatherNow.main}℃</span>
            <div className='temp-day-night'>
              <div className='temp-max'>max: <span>{weatherNow.tempMax}</span></div>
              <div className='line'></div>
              <div>min: <span>{weatherNow.tempMin}</span></div>
            </div>
          </div>
          <Autosuggest
            suggestions={citySearch}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            inputProps={inputProps}
          />

          {/* <input type='search' className='intup-city' value={city} onChange={searchCity}></input>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="duotone magnifying-glass icon-glass" onClick={submit} /> */}
          < div >
            <div className='date'>{weatherNow.date}</div>
          </div>
        </div>
      </div>
      <div className='days'>
        {weatherOnDay.map(item => {
          return (
            <div className='weather-on-day' key={item.key}>
              <h3 className='name-day'>{item.day}</h3>
              <img className='img-weather' alt='img' src={item.icon} />
              <span className='temp-max'>{item.tempMax}</span>
              <span className='temp-max'>{item.tempMin}</span>
            </div>
          )
        })}
      </div>
    </div>
  </>
  )
}
export default App;
