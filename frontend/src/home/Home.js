import React, { useContext } from "react";
import UserContext from "../auth/UserContext";
import "./Home.css";

//Simple homepage at root directory
const Home = () => {
  const { currentUser } = useContext(UserContext);
  return (
    <div>
      <div id='container'>
        <h1 id='title'>Map My Seat</h1>
        {currentUser ? (
          <h2 id='msg'>
            Welcome, {currentUser.firstName || currentUser.username}!
          </h2>
        ) : (
          <>
            <h2 id='msg'>Welcome to Map My Seat</h2>
            <p>
              sadsasMap My Seat aims to take your class roster and data and
              create a seating chart based on your specifications. To get
              started: 1. First, enter your class and student in the "Set Up
              Classes" tab. 2. Then, set up the configuration of your classroom
              and seating specifications under the "Create Classroom" tab. 3.
              Finally, click on any of the "Period" buttons on the "Create
              Classroom" page to render a seating chart for that period.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
