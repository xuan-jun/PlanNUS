import React, { useState, useEffect } from "react";
import './Login.css';
import logo from '../../assets/logo.png';

const Login = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {}, [userName, password]);

    return <div className="login-page">
        <img className="plannus-logo" src = {logo} alt = "plannus logo" />
        <div className="login-submission-form">
            <h1 className="login-title">Login</h1>
            <h1>Please enter your login details</h1>
            <form className="login-form">
                <label for='email' className="input-label">
                    <input type="text" onChange={(e) => setUserName(e.target.value)} className="email-input login-input"
                    placeholder=" "/>
                    <span className="input-title">Email</span>
                </label>
                <label for='password' className="input-label">
                    <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder=" "
                    className="password-input login-input"/>
                    <span className="input-title">Password</span>
                </label>
                <a href="https://myaces.nus.edu.sg/passwordreset/index.html;jsessionid=wDWXE7I_prAoYosbaE0t0FExIUyq8BOMZT-ssVaW.nieis002">Forgot your password?</a>
                <div className="submit-button">
                    <button className="login-button" href='./calendar'>Login</button>
                </div>
            </form>
        </div>
    </div>
}

export default Login;