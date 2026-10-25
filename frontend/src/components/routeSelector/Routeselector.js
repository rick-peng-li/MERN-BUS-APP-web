import React, { useState, useEffect } from 'react'
import './Routeselector.css'
import * as apiCall from './routeApifunc'
import BusList from '../BusList/BusList'

export default function Routeselector() {
    const [dataInp, setData] = useState('')
    const [startCity, setStartCity] = useState('')
    const [destination, setDestination] = useState('')
    const [startCities, setStartCities] = useState([])
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        apiCall.getCitiesFromApi()
            .then(res => {
                setStartCities(res.data.startCities)
                setDestinations(res.data.destinations)
            })
            .catch(() => setError('Unable to load cities, please sign in again'))
    }, [])

    const handleFromCity = e => {
        e.preventDefault()
        setStartCity(e.target.value)
        localStorage.setItem('start', e.target.value)
    }

    const handleToCity = e => {
        e.preventDefault()
        setDestination(e.target.value)
        localStorage.setItem('destination', e.target.value)
    }

    const handleDate = e => {
        e.preventDefault()
        localStorage.setItem('date', e.target.value)
    }

    const getRoutes = e => {
        e.preventDefault()
        setError('')
        if (!startCity || !destination) {
            setError('Please select the starting city and destination')
            return
        }
        setLoading(true)
        apiCall.getRoutesFromApi(startCity, destination, localStorage.getItem('date') || '')
            .then(response => {
                setLoading(false)
                const buses = response.data.bus
                if (!buses || buses.length === 0) {
                    setData('')
                    setError('No buses found for this route')
                    return
                }
                setData(buses)
            })
            .catch(() => {
                setLoading(false)
                setError('Unable to search buses, please try again')
            })
    }

    return (
        <div className="rdc">
            <div className="form-group inline"></div>
            <div className="main-container">
                <form className="form-inline" onSubmit={e => getRoutes(e)}>
                    <select name="startCity" data-style="btn-new" className="selectpicker" onChange={e => handleFromCity(e)}>
                        <option>FROM</option>
                        {startCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <select name="destination" data-style="btn-new" className="selectpicker" onChange={e => handleToCity(e)}>
                        <option>TO</option>
                        {destinations.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <input onChange={e => handleDate(e)} type="date"></input>
                    <input type="submit" className="btn btn-primary btn-md getRoute" value={loading ? 'Searching...' : 'Search'} disabled={loading} />
                </form>
                {error && <p className="text-danger mt-3">{error}</p>}
                <div>
                    {dataInp && <BusList value={dataInp} />}
                </div>
            </div>
        </div>
    )
}
