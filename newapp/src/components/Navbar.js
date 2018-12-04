import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


const NavbarLink = ({ to, label }) => (
  <li>
    <NavLink to={to} activeClassName="nav-link"> {label} </NavLink>
  </li>

)

class Navbar extends Component {
  render() {
    return (
      <div className="App">
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  
  <NavbarLink to='/' label='React App' />
  
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      
      <NavbarLink to='/category' label='category' />
      <NavbarLink to='/posts' label='posts' />
      <NavbarLink to='/login' label='login' />
      <NavbarLink to='/signup' label='signup' />
     
    </ul>

  </div>
</nav>
      </div>
    );
  }
}

export default Navbar;
