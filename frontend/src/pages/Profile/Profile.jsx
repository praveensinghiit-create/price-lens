import React from "react";
import "./Profile.css";
import { assets } from "../../assets/assets";

const defaultUser = {
  firstName: "Akshar",
  lastName: "Rampath",
  role: "Viewer", 
  jobTitle: "Chief Commercial Officer",
  department: "LKCentrix Solutions",
  email: "aksharr@lkcentrix.co.za",
  phone: "0835549197",
  officeAddress: "Bedfordview Corporate Park, 4 Skeen BLVD, Bedfordview",
  summary:
    "Over 25 Years extensive experience in Credit Bureau information solutions and services specialising in fraud prevention, data analytics, credit analysis and risk management.",
};

const roleLabels = {
  admin: { label: "Administrator", color: "#388e3c" },
  viewer: { label: "Viewer", color: "#bfc9d9" },
};

const Profile = () => {
  // Get role from localStorage (fallback to defaultUser.role)
  const role = (localStorage.getItem("role") || defaultUser.role).toLowerCase();
  const roleInfo = roleLabels[role] || { label: role, color: "#888" };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={defaultUser.picture}
          alt="Profile"
          className="profile-avatar"
        />
        <div>
          <h1 className="profile-name">
            {defaultUser.firstName} {defaultUser.lastName}
            <span
              className="profile-role-badge"
              style={{
                background: roleInfo.color,
                marginLeft: "0.7rem",
              }}
              title={roleInfo.label}
            >
              {roleInfo.label}
            </span>
          </h1>
          <div className="profile-job">{defaultUser.jobTitle}</div>
          <div className="profile-department">{defaultUser.department}</div>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">Contact Information</h2>
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Email</th>
              <td>{defaultUser.email}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{defaultUser.phone}</td>
            </tr>
            <tr>
              <th>Office Address</th>
              <td>{defaultUser.officeAddress}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">Professional Summary</h2>
        <p className="profile-summary">{defaultUser.summary}</p>
      </div>

      {/* Only show if admin */}
      {role === "admin" && (
        <div className="profile-section">
          <h2 className="profile-section-title">Admin Access</h2>
          <div className="profile-admin-note">
            You have full administrative privileges, including user management
            and system settings.
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
