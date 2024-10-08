import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-black bg-opacity-40 backdrop-blur-md shadow-lg">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-white tracking-wider">
          <Link to="/" className="hover:text-gray-600 transition duration-300">
            Expenses
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 text-white">
          {user ? (
            <>
              <li className="flex items-center">
                <Link
                  to="/"
                  className="hover:text-gray-600 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  to="/add-expense"
                  className="hover:text-gray-600 transition duration-300"
                >
                  Add Expense
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  to="/statistics"
                  className="hover:text-gray-600 transition duration-300"
                >
                  Statistics
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-white hover:bg-black border border-black hover:text-white text-black hover:border-white px-4 py-2 rounded-lg transition duration-300 shadow-md"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-gray-300 transition duration-300"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
