import React, { useState, useEffect } from 'react'
import { FaAngleDoubleDown } from 'react-icons/fa'
import './Tab.css'
import { getBusFromApi, getBookedSeatsFromApi } from '../routeSelector/routeApifunc'

const SEAT_LETTERS = ['A', 'B', 'C']

export default function SeatSelection() {
    const [bus, setBus] = useState(null)
    const [bookedSeats, setBookedSeats] = useState([])
    const [seatNumber, setSeatNumber] = useState([])
    const [passengers, setPassengers] = useState({})
    const [arrowDown, setArrowDown] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const busId = localStorage.getItem('selectedBusId')
        if (!busId) return
        const travelDate = localStorage.getItem('date') || ''
        getBusFromApi(busId)
            .then(res => setBus(res.data.bus))
            .catch(() => setError('Unable to load bus details'))
        getBookedSeatsFromApi(busId, travelDate)
            .then(res => setBookedSeats(res.data.seats || []))
            .catch(() => {})
    }, [])

    const getSeatNumber = e => {
        const seat = e.target.value
        if (bookedSeats.includes(seat)) return
        if (seatNumber.includes(seat)) {
            setSeatNumber(seatNumber.filter(s => s !== seat))
            setPassengers(prev => {
                const next = { ...prev }
                delete next[seat]
                return next
            })
        } else {
            setSeatNumber([...seatNumber, seat])
            setPassengers(prev => ({ ...prev, [seat]: { name: '', gender: '' } }))
        }
    }

    const handleGender = (e, seat) => {
        setPassengers(prev => ({ ...prev, [seat]: { ...prev[seat], gender: e.target.value } }))
    }

    const handlePassengerName = (e, seat) => {
        setPassengers(prev => ({ ...prev, [seat]: { ...prev[seat], name: e.target.value } }))
    }

    const handleSubmitDetails = e => {
        e.preventDefault()
        if (seatNumber.length === 0) {
            setError('Please select at least one seat')
            return
        }
        const missing = seatNumber.filter(seat => !passengers[seat] || !passengers[seat].name.trim() || !passengers[seat].gender)
        if (missing.length > 0) {
            setError(`Please fill in name and gender for seat ${missing.join(', ')}`)
            return
        }
        setError('')
        setArrowDown(true)
        localStorage.setItem('reservedSeats', JSON.stringify(seatNumber))
        localStorage.setItem('passengerData', JSON.stringify(seatNumber.map(seat => ({ seat, ...passengers[seat] }))))
    }

    const renderSeats = () => {
        const totalSeats = bus ? bus.totalSeats : 30
        const rowCount = Math.ceil(totalSeats / SEAT_LETTERS.length)
        const rows = []
        for (let row = 1; row <= rowCount; row++) {
            rows.push(
                <li className={`row row--${row}`} key={row}>
                    <ol className="seats" type="A">
                        {SEAT_LETTERS.map(letter => {
                            const seat = `${row}${letter}`
                            const isBooked = bookedSeats.includes(seat)
                            return (
                                <li className="seat" key={seat}>
                                    <input type="checkbox" disabled={isBooked} value={seat} id={seat} />
                                    <label htmlFor={seat}>{seat}</label>
                                </li>
                            )
                        })}
                    </ol>
                </li>
            )
        }
        return rows
    }

    const renderPassengerData = () => {
        return seatNumber.map(seat => (
            <form key={seat} className="form seatfrm">
                <p className="text-capitalize text-center">Seat No: {seat}</p>
                <input className="form-control seatInp" onChange={e => handlePassengerName(e, seat)} type="text" name="passenger-name" placeholder="Enter Name" />
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name={`gender-${seat}`} id={`male-${seat}`} value="Male" onChange={e => handleGender(e, seat)} />
                    <label className="form-check-label" htmlFor={`male-${seat}`}>Male</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name={`gender-${seat}`} id={`female-${seat}`} value="Female" onChange={e => handleGender(e, seat)} />
                    <label className="form-check-label" htmlFor={`female-${seat}`}>Female</label>
                </div>
            </form>
        ))
    }

    if (!localStorage.getItem('selectedBusId')) {
        return <div className="ss"><p className="text-center p-4">Please select a bus in the "Select Bus" tab first.</p></div>
    }

    return (
        <div className="ss">
            <div className="row">
                <div className="column1">
                    <div className="plane">
                        <form onChange={e => getSeatNumber(e)}>
                            <ol className="cabin fuselage">
                                {renderSeats()}
                            </ol>
                        </form>
                    </div>
                </div>
                <div className="column2">
                    <div className="seatInfo">
                        <form className="form-group">
                            {renderPassengerData()}
                        </form>
                        {error && <p className="text-danger text-center">{error}</p>}
                        <div>
                            <button onClick={e => handleSubmitDetails(e)} className="btn btn-info seatBT">
                                Confirm Details
                            </button>
                        </div>
                        <div className={arrowDown ? 'activeArrow2' : 'nonActive'}>
                            <FaAngleDoubleDown />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
