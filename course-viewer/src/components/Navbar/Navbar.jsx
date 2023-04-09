import React from "react";
import './Navbar.css'
import vikPicture from "../../assets/prof-vik.jpg"
import logo from "../../assets/logo.png"
import dayIcon from '../../assets/dayicon.png'
import moonIcon from '../../assets/moonicon.png'
import logoutIcon from '../../assets/logout.png'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
//import { motion } from "framer-motion";

const Navbar = ({theme, setTheme, token, removeToken}) => {

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  const instructorName = token['userName']

  return (
    <nav className="navBar">
      <div className="site-logo">
        <Link to='/'>
            <img className="logo" src={logo} alt='site-logo'/>
          </Link>
      </div>
      <div onClick={switchTheme} className='light-mode-toggle'>
        <div className={`slider ${theme === 'light' ? '-left' : '-right'}`}>
          <img className={`slider-icon ${theme === 'light' ? '-left' : '-right'}`}
           src = {theme === "light" ? dayIcon : moonIcon}/>
        </div>
      </div>
      {token ? <ul>
        <CustomLink to='/'>Calendar</CustomLink>
        <CustomLink to='/assignments'>Assignments</CustomLink>
        <div className="user-icon-profile">
          <Link to='/' className="profile-picture-link">
            <img className="profile-picture" src={vikPicture} alt='user-profile'/>
          </Link>
          <div className="user-dropdown">
            <h3 className="user-name">
              Hello {instructorName} !
            </h3>
            <hr />
            <div className="signout" onClick={()=>{removeToken()}}>
              <div className="logout-div">
                <img src = {logoutIcon}/>
              </div>
              <p className="signout-text">Sign Out</p>
            </div>
          </div>
        </div>
      </ul> : <ul>
        <CustomLink to='/calendar'>Calendar</CustomLink>
        </ul>}
    </nav>
  )
}

const CustomLink = ({ to, children, ...props}) => {
  const resolvedPath = useResolvedPath(to) // resolves the full path that we want to get to
  const isActive = useMatch({ path: resolvedPath.pathname, end: true}) // checks if the to path is the same as the current path

  return (
    <li className='navBar-components'>
      <Link className={`link-item ${isActive ? "activeLink" : ""}`} to={to}>{children}</Link>
    </li>
  )
}

export default Navbar;