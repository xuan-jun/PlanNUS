import React, { useState, useEffect } from "react";
import './Login.css';
import logo from '../../assets/logo.png';
import eyeOpen from '../../assets/eye-open.png';
import eyeClose from '../../assets/eye-close.png';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { plannus, plannusWrapper, fadeIn, staggerContainer } from "../../variants.ts";


const Login = ({setToken}) => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failedPreviously, setFailedPreviously] = useState(false);
    const [passwordHide, setPasswordHide] = useState(true);
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
        
        <motion.div variants={plannusWrapper} initial="initial" animate="animate" className="plannusWrapper">
            <motion.img src={logo} variants={plannus} className="plannus-logo" />
        </motion.div>
        <div className="login-submission-form">
            <h1 className="login-title">Login</h1>
            <h2>Please enter your login details</h2>
            {failedPreviously ? 
            <div className="failed-attempt">
                <div>&times;</div>
                <p>Incorrect email and password combination!</p>
                <div>&times;</div>
                </div> : ""}
            <form className="login-form">
                <label className="input-label">
                    <input type="email" onChange={(e) => setEmail(e.target.value)} className="email-input login-input"
                    placeholder=" " value={email} text={email}/>
                    <span className="input-title">Email</span>
                </label>
                <label className="input-label">
                    <input type={passwordHide ? "password" : "text"} onChange={(e) => setPassword(e.target.value)} placeholder=" "
                    className="password-input login-input" value={password} text={password}/>
                    <span className="input-title">Password</span>
                    {passwordHide ?
                    <img className="password-hide" src={eyeClose} onClick={() => setPasswordHide(!passwordHide)}/> :
                    <img className="password-hide" src={eyeOpen} onClick={() => setPasswordHide(!passwordHide)}/>}
                </label>
                <a href="https://myaces.nus.edu.sg/passwordreset/index.html;jsessionid=wDWXE7I_prAoYosbaE0t0FExIUyq8BOMZT-ssVaW.nieis002">Forgot your password?</a>
                <div className="submit-button" onClick={logInUser}>
                    <button class="learn-more">
                        <a href='./calendar'>Login</a>
                    </button>
                </div>
            </form>
        </div>
    </div>
}

export default Login;