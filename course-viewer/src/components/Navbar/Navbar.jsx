import React from "react";
import './navbar.css'
import profilePicture from '../../assets/profile-picture.png'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navBar">
      <div className="site-logo">
        <Link to='/'>Logo</Link>
      </div>
      <ul>
        <CustomLink to='/calendar'>Calendar</CustomLink>
        <CustomLink to='/assignments'>Assignments</CustomLink>
        <CustomLink to='/modules'>Modules</CustomLink>
        <Link to='/'>
          <img className="profile-picture" src={profilePicture} alt='user-profile'/>
        </Link>
      </ul>

    </nav>
  )
}

const CustomLink = ({ to, children, ...props}) => {
  const resolvedPath = useResolvedPath(to) // resolves the full path that we want to get to
  const isActive = useMatch({ path: resolvedPath.pathname, end: true}) // checks if the to path is the same as the current path

  return (
    <li className={isActive ? "activeLink" : ""}>
      <Link to={to}>{children}</Link>
    </li>
  )
}

export default Navbar;