// import React from 'react'
// import './Sidebar.css'
// import { assets } from '../../assets/assets'
// import { NavLink } from 'react-router-dom'

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-options">
//         <NavLink to ='/Profile' className="sidebaroption">
//           <img src={assets.profile_image} alt="" />
//           <p>Profile </p>
//         </NavLink>
//         <NavLink to='/Search' className="sidebaroption">
//           <img src={assets.search_icon} alt="" />
//           <p>Produt Search</p>
//         </NavLink>
//         <NavLink to='/ItemChart' className="sidebaroption">
//           <img src={assets.graph} alt="" />
//           <p>Item Price Chart</p>
//         </NavLink>
//         <NavLink to='/APIManagement' className="sidebaroption">
//           <img src={assets.API_symbol} alt="" />
//           <p>APIManagement</p>
//         </NavLink>
//       </div>
//     </div>
//   )
// }

// export default Sidebar
import React, { useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const { role } = useAuth();

  const handleSettingsClick = () => {
    setShowSettingsSubmenu((prev) => !prev);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {/* Only admin can see Profile */}
        {role === "admin" && (
          <NavLink to="/Profile" className="sidebaroption">
            <img src={assets.profile_image} alt="" />
            <p>Profile</p>
          </NavLink>
        )}

        {role === "admin" && (
          <>
            <div
              className={`sidebaroption settings-option${showSettingsSubmenu ? " open" : ""}`}
              onClick={handleSettingsClick}
            >
              <img src={assets.setting_button} alt="" />
              <p>Settings</p>
            </div>
            {showSettingsSubmenu && (
              <div className="sidebar-submenu">
                <NavLink
                  to="/APIManagement"
                  className="sidebaroption submenuoption"
                >
                  <p>API Management</p>
                </NavLink>
                <NavLink
                  to="/settings/search-source-setup"
                  className="sidebaroption submenuoption"
                >
                  <p>Product Source</p>
                </NavLink>
                <NavLink
                  to="/settings/product-Set-Up"
                  className="sidebaroption submenuoption"
                >
                  <p>Product Set Up</p>
                </NavLink>
              </div>
            )}
            <NavLink
              to="/settings/report-management"
              className="sidebaroption submenuoption"
            >
              <img src={assets.user_access} alt="" />
              <p>Report Management</p>
            </NavLink>
            <NavLink to="/settings/user-management" className="sidebaroption">
              <img src={assets.user_access} alt="" />
              <p>User Access</p>
            </NavLink>
          </>
        )}

        {/* Always visible */}
        <NavLink to="/Search" className="sidebaroption">
          <img src={assets.search_icon} alt="" />
          <p>Product Search</p>
        </NavLink>
        <NavLink to="/ItemChart" className="sidebaroption">
          <img src={assets.graph} alt="" />
          <p>Item Price Chart</p>
        </NavLink>
        <NavLink to="/ChatComponent" className="sidebaroption">
          <img src={assets.search_icon} alt="" />
          <p>PriceLens AI</p>
        </NavLink>
        <NavLink to="/ReportRequest" className="sidebaroption">
          <img src={assets.report} alt="" />
          <p>Report Request</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
