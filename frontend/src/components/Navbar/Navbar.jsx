// import React from 'react'
// import './Navbar.css'
// import {assets} from '../../assets/assets.js'

// const Navbar = () => {
//   return (
//     <div className="navbar">
//         <img className= 'sa_log' src={assets.sa_logo} alt="" />
//         <img className='logo' src={assets.logo} alt="" />
//         <img className='flag' src={assets.sa_flag} alt="" />
//     </div>
//   )
// }

// export default Navbar

// src/components/Navbar/navbar.jsx
import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets.js';

const Navbar = ({ onLogout }) => {
  return (
    <div className="navbar">
      <img className='sa_log' src={assets.Cojlogo} alt="" />
      <div className="navbar-title">
        <span className="gov-title">City of Johannesburg</span>
        <br />
        <span className="gov-subtitle">a world class African city</span>
      </div>
      <div className="navbar-actions">
        <img className='flag' src={assets.LKCENTRIX_SOLUTIONS_LOGO_b} alt="" />
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
