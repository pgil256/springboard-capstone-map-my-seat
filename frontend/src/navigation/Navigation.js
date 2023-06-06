import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navigation.css";
import UserContext from "../auth/UserContext";

const Navigation = ({ logout }) => {
  const currentUser = useContext(UserContext);
  const isLoggedIn = !currentUser;

  function loggedInNav() {
    return (
      <ul>
        <li>
          <NavLink exact to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/periods">Set up Classes</NavLink>
        </li>
        <li>
          <NavLink to="/classrooms">Create Classroom</NavLink>
        </li>
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li>
          <Link to="/" onClick={logout}>
            Log Out
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul>
        <li>
          <NavLink exact to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Sign Up</NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav>
      <Link to="/">Map My Seat</Link>
      {isLoggedIn ? loggedOutNav() : loggedInNav()}
    </nav>
  );
};

export default Navigation;

