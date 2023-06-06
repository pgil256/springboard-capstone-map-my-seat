import React, { useState, useEffect, useContext } from "react";
import UserContext from "../auth/UserContext";
import { useNavigate  } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner.js";
import SeatingApi from "../api";
import "./Classroom.css";

//Renders button based on the periods for the current user
//Each button will render a seating chart based on the data collected in Classroom.js and ClassroomForm.js
const ClassroomRedirect = (props) => {
  const classroomId = props.classroomId;
  const [periods, setPeriods] = useState([]);
  const [infoLoading, setInfoLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const username = currentUser.username;

  const getPeriodsOnMount = async (isMounted) => {
    try {
      const periods = await SeatingApi.getPeriods(username);
      if (isMounted) {
        setPeriods(periods);
        setInfoLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getPeriodsOnMount(isMounted);

    return () => {
      isMounted = false;
    };
  }, [username]);

  const getSeatingChart = (e, number) =>{
    e.preventDefault();
    navigate(`/classrooms/${classroomId}/seating-charts/${number}`);
  }

  return (
    <div>
      {infoLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p>Create Seating Chart:</p>
          {periods && Object.values(periods).length ? (
            Object.values(periods).map((period) => (
              <button
                onClick={(e) => getSeatingChart(e, period.number)}
                value={period.number}
                key={period.number}>
                <span>Period {period.number}</span>
              </button>
            ))
          ) : (
            <p>No periods added yet</p>
          )}
        </>
      )}
    </div>
  );
};
export default ClassroomRedirect;
