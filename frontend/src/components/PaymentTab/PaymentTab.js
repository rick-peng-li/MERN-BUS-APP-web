import React, { useState, useEffect } from 'react'
import Card from 'react-credit-cards'
import './PaymentTab.css'
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate
} from './utils'
import { getBusFromApi, createBookingApi } from '../routeSelector/routeApifunc'
import { getCurrentUserDetails } from '../Login-Signup/loginFunctions'
import 'react-credit-cards/es/styles-compiled.css'

const TAX_AMOUNT = 150

export default function PaymentTab({ history }) {
    const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '', focused: '' })
    const [bus, setBus] = useState(null)
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [paying, setPaying] = useState(false)

    const busId = localStorage.getItem('selectedBusId')
    const seats = JSON.parse(localStorage.getItem('reservedSeats') || '[]')
    const passengers = JSON.parse(localStorage.getItem('passengerData') || '[]')
    const travelDate = localStorage.getItem('date') || ''

    useEffect(() => {
        if (busId) {
            getBusFromApi(busId)
                .then(res => setBus(res.data.bus))
                .catch(() => setError('Unable to load bus details'))
        }
        getCurrentUserDetails()
            .then(res => setUsername(res.data.user.name))
            .catch(() => {})
    }, [busId])

    const handleInputFocus = ({ target }) => {
        setCard(prev => ({ ...prev, focused: target.name }))
    }

    const handleInputChange = ({ target }) => {
        if (target.name === 'number') {
            target.value = formatCreditCardNumber(target.value)
        } else if (target.name === 'expiry') {
            target.value = formatExpirationDate(target.value)
        } else if (target.name === 'cvc') {
            target.value = formatCVC(target.value)
        }
        setCard(prev => ({ ...prev, [target.name]: target.value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        setError('')
        if (!busId || seats.length === 0) {
            setError('Please select a bus and seats before paying')
            return
        }
        setPaying(true)
        createBookingApi({ busId, travelDate, seats, passengers })
            .then(res => {
                localStorage.setItem('lastBookingTxn', res.data.booking.transactionId)
                history.push('/getTicket')
            })
            .catch(err => {
                setPaying(false)
                setError(err.response?.data?.message || 'Payment failed, please try again')
            })
    }

    const renderNamesOfPassenger = () => {
        return passengers.map(p => <p key={p.seat}>{p.name}</p>)
    }

    const renderSeatNumbers = () => {
        return seats.map(seat => <p key={seat}>{seat}</p>)
    }

    const pricePerSeat = bus ? bus.pricePerSeat : Number(localStorage.getItem('pricePerSeat')) || 0
    const ticketTotal = pricePerSeat * seats.length

    if (!busId) {
        return <div className="paym"><p className="text-center p-4">Please select a bus and seats before paying.</p></div>
    }

    return (
        <div className="paym">
            <div className="row">
                <div key="Payment">
                    <div className="App-payment cl-1">
                        <p className="pPayment">Enter Credit card details</p>
                        <Card number={card.number} name={card.name} expiry={card.expiry} cvc={card.cvc} focused={card.focused} />
                        <form className="credit-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="tel" name="number" className="frm-ctrl" placeholder="Card Number" pattern="[\d| ]{16,22}" required onChange={handleInputChange} onFocus={handleInputFocus} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="name" className="frm-ctrl" placeholder="Name" required onChange={handleInputChange} onFocus={handleInputFocus} />
                            </div>
                            <div className="form-group">
                                <input type="tel" name="expiry" className="frm-ctrl" placeholder="Valid Thru" pattern="\d\d/\d\d" required onChange={handleInputChange} onFocus={handleInputFocus} />
                            </div>
                            <div className="form-group">
                                <input type="tel" name="cvc" className="frm-ctrl cvc" placeholder="CVC" pattern="\d{3,4}" required onChange={handleInputChange} onFocus={handleInputFocus} />
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                            <div>
                                <button type="submit" disabled={paying} className="btn btn-light btCustom">
                                    {paying ? 'PROCESSING...' : 'PAY'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="columnTwo">
                    <h3>Unique Travels</h3>
                    <div>
                        <p>BOOKING DETAILS</p>
                        <div className="row">
                            <div className="col-6 pt">
                                <p className="hdng">Username</p><hr className="hr3" />
                                <p className="hdng">Date</p>
                                <p className="hdng">From</p>
                                <p className="hdng">To</p><hr className="hr3" />
                                <p className="hdng">Passengers</p>
                                {renderNamesOfPassenger()}
                                <hr className="hr3" />
                                <p className="hdng">Ticket price</p>
                                <p className="hdng">Tax</p>
                                <p className="hdng">Total Sum</p>
                            </div>
                            <div className="col-6">
                                <p className="usrName">{username}</p><hr className="hr3" />
                                <p className="usrName">{travelDate}</p>
                                <p className="usrName">{localStorage.getItem('start')}</p>
                                <p className="usrName">{localStorage.getItem('destination')}</p>
                                <hr className="hr3" />
                                <p className="hdng">Seat No</p>
                                {renderSeatNumbers()}
                                <div>
                                    <hr className="hr3" />
                                    <p>{ticketTotal}</p>
                                    <p>+{TAX_AMOUNT}</p>
                                    <p>{ticketTotal + TAX_AMOUNT}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
