import React, { useState } from 'react'
import * as signupFunc from './SignupFunctions'
import { FaFacebookF, FaTwitterSquare } from 'react-icons/fa'
import './signup.css'

export default function Signup({ history }) {
    const [newUser, setNewUser] = useState({})
    const [error, setError] = useState('')

    const handleChangeEvent = (e, field) => {
        setError('')
        setNewUser({ ...newUser, [field]: e.target.value })
    }

    const getToSignIn = e => {
        e.preventDefault()
        history.push('/login')
    }

    const submitData = e => {
        e.preventDefault()
        signupFunc.registerUser(newUser)
            .then(() => history.push('/login'))
            .catch(err => {
                setError(err.response?.data?.message || 'Unable to register, please try again')
            })
    }

    return (
        <div className="container">
            <div className="flex-container">
                <div className="row full">
                    <div className="col-md-12">
                        <div className="form-container">
                            <div className="form-container-in"></div>
                            <div className="row sgnUp">
                                <div className="col-md-6 right-divider pdding">
                                    <h3 className="lead-text mn-txt">Join Us with Social</h3>
                                    <div className="icon-soc-fb">
                                        <FaFacebookF />
                                    </div>
                                    <div className="icon-soc-tw">
                                        <FaTwitterSquare />
                                    </div>
                                </div>
                                <div className="left-divider">
                                    <div className="col-md-6">
                                        <form onSubmit={e => submitData(e)}>
                                            <div className="form-group2">
                                                <label htmlFor="name">Name:</label>
                                                <input id="name" type="text" className="form-control sgnUp" required onChange={e => handleChangeEvent(e, 'name')} />
                                            </div>
                                            <div className="form-group2">
                                                <label htmlFor="email">Email - ID:</label>
                                                <input required id="email" type="email" className="form-control sgnUp" onChange={e => handleChangeEvent(e, 'email')} />
                                            </div>
                                            <div className="form-group2">
                                                <label htmlFor="mob-number">Mobile - No.:</label>
                                                <input required id="mob-number" type="text" className="form-control sgnUp" onChange={e => handleChangeEvent(e, 'mobile')} />
                                            </div>
                                            <div className="form-group2">
                                                <label htmlFor="dob">Date of Birth:</label>
                                                <input id="dob" type="date" className="form-control sgnUp" onChange={e => handleChangeEvent(e, 'dob')} />
                                            </div>
                                            <div className="form-check form-check-inline rd">
                                                <input required className="form-check-input" type="radio" id="Male" name="gender" value="Male" onChange={e => handleChangeEvent(e, 'gender')} />
                                                <label className="form-check-label" htmlFor="Male">Male</label>
                                            </div>
                                            <div className="form-check form-check-inline rd">
                                                <input required className="form-check-input" type="radio" id="Female" name="gender" value="Female" onChange={e => handleChangeEvent(e, 'gender')} />
                                                <label className="form-check-label" htmlFor="Female">Female</label>
                                            </div>
                                            <div className="form-group2">
                                                <label htmlFor="password">Password:</label>
                                                <input required id="password" type="password" className="form-control sgnUp" onChange={e => handleChangeEvent(e, 'password')} />
                                            </div>
                                            {error && <p className="text-danger">{error}</p>}
                                            <div className="form-group2">
                                                <input type="submit" value="submit" className="btn-primary btnn form-submit sub-btn sgnUp" />
                                            </div>
                                            <div>
                                                <small className="form-text text-muted link-text">Already a User?</small>
                                                <span className="signuptext">
                                                    <a href="/#" onClick={e => getToSignIn(e)}>Sign-In</a>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
