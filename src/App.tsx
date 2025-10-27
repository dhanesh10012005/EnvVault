import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AddProject from "./Pages/AddProject";
import Home from "./Pages/Home";
import ViewProject from "./Pages/ViewProject";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import { AuthContext } from "./AuthContext";
import SignUp from "./Pages/SignUp";

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <div>
      {token && <Navbar />}

      <div className={`${token ? "p-16" : ""}`}>
        <Routes>
          {/* If no token, redirect everything to login */}
          {!token ? (
            <>
              <Route path="*" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp/>} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/addproj" element={<AddProject />} />
              <Route path="/viewproj" element={<ViewProject />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default App;
