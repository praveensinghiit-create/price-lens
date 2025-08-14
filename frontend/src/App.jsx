import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Profile from "./pages/Profile/Profile";
import Search from "./pages/Search/Search";
import ItemChart from "./pages/ItemChart/ItemChart";
import APIManagement from "./pages/APIManagement/APIManagement";
import Login from "./components/Login/Login";
import UserManagement from "./pages/UserManagement/UserManagement";
import SearchSource from "./pages/SearchSource/SearchSource";
import ProductSetUp from "./pages/ProductSetUp/ProductSetUp";
import ReportRequest from "./pages/ReportRequest/ReportRequest";
import NotFound from "./pages/NotFound/NotFound";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ReportManagement from "./pages/ReportManagement/ReportManagement";
import ChatComponent from "./components/Chat/ChatComponent";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    navigate("/profile");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <hr />
      <div className="app-content">
        {isAuthenticated && <Sidebar />}
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              isAuthenticated ? <Search /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/ChatComponent"
            element={
              isAuthenticated ? <ChatComponent/> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/itemchart"
            element={
              isAuthenticated ? <ItemChart /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/reportrequest"
            element={
              isAuthenticated ? (
                <ReportRequest />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/apimanagement"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={["admin"]}
              >
                <APIManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/user-management"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={["admin"]}
              >
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/search-source-setup"
            element={
              isAuthenticated ? (
                <SearchSource />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/settings/product-Set-Up"
            element={
              isAuthenticated ? (
                <ProductSetUp />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/settings/report-management"
            element={
              isAuthenticated ? (
                <ReportManagement />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
      {/* Only admin can access Profile */}
          <Route
            path="/profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={["admin"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          
          <Route
            path="*"
            element={
              isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
