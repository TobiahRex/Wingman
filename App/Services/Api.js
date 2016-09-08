// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Reactotron from 'reactotron'

// our "constructor"
const create = (baseURL = 'http://openweathermap.org/data/2.1') => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000,
    headers: { 'Cache-Control': 'no-cache' }
  })

  const addMonitor = api.addMonitor((response) => {
    Reactotron.apiLog(response)
  })

  const getCity = (city) => api.get('/find/name', {q: city})

  return {
    getCity,
    addMonitor
  }
}

export default {
  create
}
