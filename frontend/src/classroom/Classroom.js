import React, { useState, useCallback, useEffect } from "react";
import "./Classroom.css";
import LoadingSpinner from "../common/LoadingSpinner.js";

//Creates the dynamic table for the classroom
//Uses state to apply css classes at various divs in in the table matrix
//Passes data back to classroom form through updateSeatingConfig function, passed down as prop
const Classroom = (props) => {
  const currentSeatingConfig = props.seatingConfig;
  const updateSeatingConfig = props.updateSeatingConfig;

  const [isLoading, setIsLoading] = useState(true);
  const [seatStyle, setSeatStyle] = useState(null);
  const [matrix, setMatrix] = useState(currentSeatingConfig);

  const makeHtmlMatrix = useCallback(() => {
    if (!handleTableClick) {
      console.error("handleTableClick not initialized");
      return;
    }
    const height = 12;
    const width = 12;
    const rows = [];
    for (let y = 0; y < height; y++) {
      const cells = [];
      for (let x = 0; x < width; x++) {
        cells.push(
          <td key={`${y}-${x}`} id={`${y}-${x}`} onClick={handleTableClick} />
        );
      }
      rows.push(<tr key={y}>{cells}</tr>);
    }
    addTeacherDesk(rows);
    addStudentDesks(rows);
    setMatrix(rows);
  });

  const addTeacherDesk = (rows) => {
    if (!rows) {
      console.error("Missing required variable: rows");
      return;
    }

    const teacherDesk = "teacher-desk";
    let x = 0;
    let y = 0;

    while (x < rows[0].length && !rows[y][x].includes(teacherDesk)) {
      x++;
      if (x >= rows[0].length) {
        console.error("No teacher desk found in rows");
        return;
      }
    }
    y = rows.findIndex((row) => row.includes(teacherDesk));
    if (y === -1) {
      console.error("No spot found for teacher desk in rows");
      return;
    }
    const newTeacherDesk = (
      <div className={teacherDesk} style={{ top: `${-50 * (y + 2)}px` }} />
    );
    return newTeacherDesk;
  };

  const addStudentDesks = (rows) => {
    if (!rows) {
      console.error("Missing required variable");
      return;
    }
    const studentDesk = "desk";
    const desks = [];
    for (let y = 0; y < rows.length; y++) {
      let row = rows[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === studentDesk) {
          const desk = (
            <div
              className={studentDesk}
              style={{ top: `${-50 * (y + 2)}px` }}
              key={`${y}-${x}`}
            />
          );
          desks.push(desk);
        }
      }
    }
    return desks;
  };
  const handleTableClick = (evt) => {
    const id = evt.currentTarget.id;
    const idArray = id.split("-");
    const y = parseInt(idArray[0]);
    const x = parseInt(idArray[1]);

    setIsLoading(true);
    if (matrix[y][x]) {
      matrix[y].splice(x, 1, seatStyle);
      setMatrix([...matrix]);
      updateSeatingConfig(matrix);
    } else {
      matrix[y].splice(x, 1, "");
      setMatrix([...matrix]);
      handleMatrix(x, y);
    }
  };

  const handleMatrix = (x, y, matrix) => {
    const newMatrix = [...matrix];
    newMatrix[y].splice(x, 1, seatStyle);

    setMatrix(newMatrix);
    updateSeatingConfig(newMatrix);

    setIsLoading(false);
  };

  useEffect(() => {
    makeHtmlMatrix();
  }, [makeHtmlMatrix]);

  return (
    <div>
      <form id='SeatStyleForm'>
        <div id='seat-form-div'>
          <label>Seat Style:</label>
          <div>
            <input
              type='radio'
              name='seatStyle'
              className='teacher-desk-seat'
              id='teacher-desk-seat'
              value='teacher-desk'
              onChange={() => setSeatStyle("teacher-desk")}
              checked={seatStyle === "teacher-desk"}
            />
            <label htmlFor='teacher-desk-seat'>Teacher Desk</label>
          </div>
          <div>
            <input
              type='radio'
              name='seatStyle'
              className='student-desk-seat'
              id='student-desk-seat'
              value='student-desk'
              onChange={() => setSeatStyle("student-desk")}
              checked={seatStyle === "student-desk"}
            />
            <label htmlFor='student-desk-seat'>Student Desk</label>
          </div>
        </div>
      </form>

      <>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table id='matrix'>
            <tbody>
              {matrix.map((row) => (
                <tr key={row[0].id} className={row.className}>
                  {row.map((seat) => (
                    <td key={seat.id} className={seat.className}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    </div>
  );
};

export default Classroom;
