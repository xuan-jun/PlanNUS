import React, { useState, useEffect } from "react";
import './Login.css';
import logo from '../../assets/logo.png';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = ({setToken}) => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failedPreviously, setFailedPreviously] = useState(false);
    const navigate = useNavigate();
    
    // makes an api call to try and log in the user
    const logInUser = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post('/token',
            { "email" : email, "password" : password });
            const responseData = response.data
            const responseToken = {
                "userToken" : responseData.access_token,
                "userName" : responseData.name
            }
            setEmail("")
            setPassword("")
            setToken(responseToken)
            setFailedPreviously(false)
            navigate('/calendar')
        }
        catch (error) {
            setFailedPreviously(true)
            setEmail("")
            setPassword("")
        }
        
    }

    useEffect(() => {}, [email, password]);

    return <div className="login-page">
        <img className="plannus-logo" src = {logo} alt = "plannus logo" />
        <div className="login-submission-form">
            <h1 className="login-title">Login</h1>
            <h1>Please enter your login details</h1>
            {failedPreviously ? 
            <div className="failed-attempt">
                <div>&times;</div>
                <p>Incorrect email and password combination</p>
                </div> : ""}
            <form className="login-form">
                <label className="input-label">
                    <input type="text" onChange={(e) => setEmail(e.target.value)} className="email-input login-input"
                    placeholder=" " value={email} text={email}/>
                    <span className="input-title">Email</span>
                </label>
                <label className="input-label">
                    <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder=" "
                    className="password-input login-input" value={password} text={password}/>
                    <span className="input-title">Password</span>
                </label>
                <a href="https://myaces.nus.edu.sg/passwordreset/index.html;jsessionid=wDWXE7I_prAoYosbaE0t0FExIUyq8BOMZT-ssVaW.nieis002">Forgot your password?</a>
                <div className="submit-button" onClick={logInUser}>
                    <button className="login-button" href='./calendar'>Login</button>
                </div>
            </form>
        </div>
    </div>
}

export default Login;