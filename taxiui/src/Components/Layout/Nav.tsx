import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-pink-200 border-pink-600 border-b-2 p-4 mb-4">
      <ul className="flex justify-around">
        <li>
          <Link to="/account" className="text-pink-800 font-bold">
            Profile
          </Link>
        </li>
        {role === "User" && (
          <>
            <li>
              <Link to="/new-drive" className="text-pink-800 font-bold">
                New Drive
              </Link>
            </li>
            <li>
              <Link to="/previous-drives" className="text-pink-800 font-bold">
                Previous Drives
              </Link>
            </li>
          </>
        )}
        {role === "Driver" && (
          <>
            <li>
              <Link to="/new-rides" className="text-pink-800 font-bold">
                New Drives
              </Link>
            </li>
            <li>
              <Link to="/my-rides" className="text-pink-800 font-bold">
                My Drives
              </Link>
            </li>
          </>
        )}
        {role === "Admin" && (
          <>
            <li>
              <Link to="/verification" className="text-pink-800 font-bold">
                Verification
              </Link>
            </li>
            <li>
              <Link to="/all-rides" className="text-pink-800 font-bold">
                All Rides
              </Link>
            </li>
          </>
        )}
        <li>
          <button onClick={handleLogout} className="text-pink-800 font-bold">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
