import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <div className="notfound-container">
    <div className="notfound-emoji">🐾</div>
    <div className="notfound-title">404</div>
    <div className="notfound-text">
      Oops! The page you’re looking for doesn’t exist.<br />
      But this little paw tried its best to find it!
    </div>
    <Link className="notfound-link" to="/profile">
      Go Home
    </Link>
  </div>
);

export default NotFound;
