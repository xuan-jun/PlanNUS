import React from "react";
import './Navbar.css'
import profilePicture from '../../assets/profile-picture.png'
import vikPicture from "../../assets/prof-vik.jpg"
import logo from "../../assets/logo.png"
import dayIcon from '../../assets/dayicon.png'
import moonIcon from '../../assets/moonicon.png'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const Navbar = ({theme, setTheme}) => {

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

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
      <ul>
        <CustomLink to='/calendar'>Calendar</CustomLink>
        <CustomLink to='/assignments'>Assignments</CustomLink>
        <CustomLink to='/calendar-student'>CalendarStudent</CustomLink>
        <Link to='/'>
          <img className="profile-picture" src={vikPicture} alt='user-profile'/>
        </Link>
      </ul>

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