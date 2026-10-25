import React, { useState, useEffect } from 'react'
import './TicketPage.css'
import { getTicketFromApi } from '../routeSelector/routeApifunc'

export default function TicketPage({ history }) {
    const [booking, setBooking] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const txnId = localStorage.getItem('lastBookingTxn')
        if (!txnId) {
            setError('No recent booking found. Please book a ticket first.')
            return
        }
        getTicketFromApi(txnId)
            .then(res => setBooking(res.data.booking))
            .catch(() => setError('Unable to load the ticket, please sign in again'))
    }, [])

    const handleSignOut = e => {
        e.preventDefault()
        sessionStorage.removeItem('authToken')
        localStorage.clear()
        history.push('/')
    }

    const handleBookAgainIcon = e => {
        e.preventDefault()
        history.push('/routes')
    }

    const bus = booking ? booking.bus : {}

    return (
        <div className="container">
            <div>
                <nav className="mb-4 navbar navbar-expand-lg navbar-dark bg-unique hm-gradient">
                    <a href="/#" className="navbar-brand Company-Log" onClick={handleBookAgainIcon}>UT</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-3" aria-controls="navbarSupportedContent-3" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent-3">
                        <ul className="navbar-nav ml-auto nav-flex-icons ic">
                            <li className="nav-item">
                                <a href="/#" className="nav-link waves-effect waves-light" onClick={e => handleBookAgainIcon(e)}>Book Again</a>
                            </li>
                            <li className="nav-item">
                                <a href="/#" className="nav-link waves-effect waves-light" onClick={e => handleSignOut(e)}>Sign-Out</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="tpMain">
                {error && <p className="text-danger">{error}</p>}
                {!booking && !error && <p>Loading ticket...</p>}
                {booking && (
                    <article className="ticket">
                        <header className="ticket__wrapper">
                            <div className="ticket__header">
                                🎟 UNIQUE TRAVELS
                            </div>
                        </header>
                        <div className="ticket__divider">
                            <div className="ticket__notch"></div>
                            <div className="ticket__notch ticket__notch--right"></div>
                        </div>
                        <div className="ticket__body">
                            <section className="ticket__section">
                                <p>From: {bus.startCity}</p>
                                <p>To: {bus.destination}</p>
                                <p>{bus.companyName} · {bus.busType} · {bus.busNumber}</p>
                                <div>
                                    {booking.seats.map((seat, idx) => <p className="seatNo" key={idx}>{seat}</p>)}
                                </div>
                                <p>Your seats are together <span>On: {booking.travelDate}, 10 AM (Hourly commute)</span></p>
                            </section>
                            <section className="ticket__section">
                                <h3>Passenger Names</h3>
                                {booking.passengers.map((p, idx) => <p className="names" key={idx}>{p.name} ({p.gender})</p>)}
                            </section>
                            <section className="ticket__section">
                                <h3>Payment Method</h3>
                                <p>Credit Card</p>
                                <p>Total Paid: ₹{booking.totalAmount}</p>
                            </section>
                        </div>
                        <footer className="ticket__footer">
                            <p>Transaction-ID</p>
                            <p className="idData">{booking.transactionId}</p>
                        </footer>
                    </article>
                )}
            </div>
        </div>
    )
}
