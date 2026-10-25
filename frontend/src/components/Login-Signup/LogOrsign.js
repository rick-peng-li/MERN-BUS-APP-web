import React, { useState } from 'react'
import * as logFunc from './loginFunctions.js'
import './logOrsign.css'
import { FaFacebookF, FaTwitterSquare } from "react-icons/fa";

export default function LogOrsign({ history }) {

    const [userData, setUserData] = useState({})
    const [error, setError] = useState('')

    const getToSignUp = e => {
        e.preventDefault()
        history.push('/register')
    }

    const handleChangeEvent = (e, title) => {
        setError('')
        setUserData({ ...userData, [title]: e.target.value })
    }

    const submitData = e => {
        e.preventDefault()
        logFunc.logUserIn(userData)
            .then(response => {
                const { token } = response.data
                sessionStorage.setItem('authToken', token)
                history.push('/routes')
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Unable to sign in, please try again')
            })
    }

    return (
        <div className="container">
            <section className="myform-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="form-area login-form">
                                <div className="form-content">
                                    <h2>Login</h2>
                                    <p>you chose the right option</p>
                                    <ul>
                                        <li><a href="/#" className="facebook"><FaFacebookF /></a></li>
                                    </ul>
                                    <ul>
                                        <li><a href="/#" className="twitter"><FaTwitterSquare /></a></li>
                                    </ul>
                                </div>
                                <div className="form-input">
                                    <h2>Enter Credentials</h2>
                                    <form onSubmit={(e) => { submitData(e) }}>
                                        <div className="form-group">
                                            <input className="loginInfo" type="email" name="name" required onChange={e => handleChangeEvent(e, 'email')} />
                                            <label>Email-Id</label>
                                        </div>
                                        <div className="form-group">
                                            <input className="loginInfo" type="password" name="password" required onChange={e => handleChangeEvent(e, 'password')} />
                                            <label>password</label>
                                        </div>
                                        {error && <p className="text-danger">{error}</p>}
                                        <div className="myform-button">
                                            <button type="submit" className="myform-btn">Login</button>
                                        </div>
                                        <div>
                                            <small className="form-text text-muted signup-text">New here?
                                            </small>
                                            <span className="signUPtext"><a href="/#" onClick={(e) => getToSignUp(e)}>Sign-Up</a></span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
