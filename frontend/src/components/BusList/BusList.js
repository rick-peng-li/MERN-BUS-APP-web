import React, { useState } from 'react'
import { FaAngleDoubleDown } from 'react-icons/fa'
import './busList.css'

export default function BusList({ value: dataInp }) {
    const [selectedBusId, setSelectedBusId] = useState('')
    const [arrowDown, setArrowDown] = useState(false)

    const handleSubmit = bus => {
        setSelectedBusId(bus._id)
        setArrowDown(true)
        localStorage.setItem('selectedBusId', bus._id)
        localStorage.setItem('pricePerSeat', bus.pricePerSeat)
        localStorage.removeItem('reservedSeats')
        localStorage.removeItem('passengerData')
    }

    const handleReset = e => {
        e.preventDefault()
        setSelectedBusId('')
        setArrowDown(false)
        localStorage.removeItem('selectedBusId')
        localStorage.removeItem('pricePerSeat')
    }

    const renderFunction = () => {
        return dataInp.map(bus => (
            <div key={bus._id} className="card mt-5 buslist">
                <div className="row ml-3">
                    <div className="col-6 col-sm-3 mt-2 font-weight-bold">Brand</div>
                    <div className="col-6 col-sm-3 mt-2 font-weight-bold">From</div>
                    <div className="col-6 col-sm-3 mt-2 font-weight-bold">To</div>
                    <div className="col-6 col-sm-3 mt-2 font-weight-bold">Price</div>

                    <div className="w-100 d-none d-md-block"></div>

                    <div className="col-6 col-sm-3 mb-2">{bus.companyName}</div>
                    <div className="col-6 col-sm-3 mb-2">{bus.startCity}</div>
                    <div className="col-6 col-sm-3 mb-2">{bus.destination}</div>
                    <div className="col-6 col-sm-3 mb-2">{bus.pricePerSeat}</div>

                    <div className="col-6 col-sm-3 mb-4 text-muted small">{bus.busType} · {bus.busNumber}</div>
                    <div className="col-6 col-sm-3 mb-4 text-muted small">Seats left: {bus.availableSeats}</div>
                    <div className="col-6 col-sm-3 mb-4"></div>
                    <div className="col-6 col-sm-3 mb-4"></div>

                    <div className="col-6 col-sm-4 mb-2 ml-0">
                        <button className={selectedBusId && selectedBusId !== bus._id ? 'btn btn-primary btn-md disabled' : 'btn btn-primary btn-md'} onClick={() => handleSubmit(bus)} disabled={!!selectedBusId && selectedBusId !== bus._id}>
                            {selectedBusId === bus._id ? 'Selected' : 'Book Now'}
                        </button>
                    </div>
                    <div className="col-6 col-sm-4 mb-2 ml-0">
                        {selectedBusId === bus._id && <span className="badge badge-danger ml-5" onClick={e => handleReset(e)}>Reset</span>}
                    </div>
                </div>
            </div>
        ))
    }

    return (
        <div>
            {renderFunction()}
            <div className={arrowDown ? 'activeArrow' : 'nonActive'}>
                <FaAngleDoubleDown />
            </div>
        </div>
    )
}
