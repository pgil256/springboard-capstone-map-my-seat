import React, { useState, useEffect, useContext, useCallback } from "react";
import Classroom from "./Classroom.js";
import ClassroomRedirect from "./ClassroomRedirect.js";
import "./Classroom.css";
import SeatingApi from "../api";
import LoadingSpinner from "../common/LoadingSpinner.js";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";

//Parent component to ClassroomForm and ClassroomRedirect

const ClassroomForm = () => {
  const { currentUser } = useContext(UserContext);
  const username = currentUser.username;

  const [classroom, setClassroom] = useState({});
  const [classroomId, setClassroomId] = useState("");
  const [formData, setFormData] = useState({});
  const [seatingConfig, setSeatingConfig] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [saveConfirmed, setSaveConfirmed] = useState(null);

  const updateSeatingConfig = (seatingConfig) => {
    if (seatingConfig) {
      setSeatingConfig(seatingConfig);
    }
  };

  const getClassroomOnMount = useCallback(
    (async () => {
      try {
        let classroom = await SeatingApi.getClassroom(username);
        if (classroom) {
          setClassroom(classroom);
          setClassroomId(classroom.classroomId);
          setSeatingConfig(classroom.seatingConfig);
          setFormDataFromModel(classroom);
        } else {
          let classroom = await SeatingApi.createClassroom(username);
          if (classroom) {
            setClassroom(classroom);
            setClassroomId(classroom.classroomId);
            setSeatingConfig(classroom.seatingConfig);
            setFormDataFromModel(classroom);
          }
        }
        setInfoLoading(false);
      } catch (err) {
        console.error(
          "Error while retrieving or creating classroom:",
          err.message
        );
      }
    },
    [username])
  );

  const setFormDataFromModel = (formModel) => {
    setFormData({
      classroomId: formModel.classroomId,
      seatAlphabetical: formModel.seatAlphabetical,
      seatRandomize: formModel.seatRandomize,
      seatHighLow: formModel.seatHighLow,
      seatMaleFemale: formModel.seatMaleFemale,
      eseIsPriority: formModel.eseIsPriority,
      ellIsPriority: formModel.ellIsPriority,
      fiveZeroFourIsPriority: formModel.fiveZeroFourIsPriority,
      ebdIsPriority: formModel.ebdIsPriority,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      seatAlphabetical: formData.seatAlphabetical,
      seatRandomize: formData.seatRandomize,
      seatHighLow: formData.seatHighLow,
      seatMaleFemale: formData.seatMaleFemale,
      eseIsPriority: formData.eseIsPriority,
      ellIsPriority: formData.ellIsPriority,
      fiveZeroFourIsPriority: formData.fiveZeroFourIsPriority,
      ebdIsPriority: formData.ebdIsPriority,
      seatingConfig: seatingConfig,
    };

    try {
      const updatedClassroom = await SeatingApi.updateClassroom(
        username,
        classroomId,
        data
      );
      setClassroom(updatedClassroom);
      setSaveConfirmed(["Changes saved successfully"]);
    } catch (err) {
      console.error("Classroom update failed", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    getClassroomOnMount();
  }, [username]);

  if (infoLoading) {
    return <LoadingSpinner />;
  } else if (classroom) {
    return (
      <div>
        <form id={classroom.classroomId} onSubmit={handleSubmit}>
          <div id='priority-form-div'>
            <p>Seat near front:</p>
            <input
              type='checkbox'
              name='eseIsPriority'
              value={formData.eseIsPriority}
              checked={formData.eseIsPriority}
              onChange={handleChange}
              id='eseIsPriority'
            />
            <label htmlFor='eseIsPriority'>ESE</label>

            <input
              type='checkbox'
              name='fiveZeroFourIsPriority'
              value={formData.fiveZeroFourIsPriority}
              checked={formData.fiveZeroFourIsPriority}
              onChange={handleChange}
              id='fiveZeroFourIsPriority'
            />
            <label htmlFor='fiveZeroFourIsPriority'>504</label>

            <input
              type='checkbox'
              name='ellIsPriority'
              value={formData.ellIsPriority}
              checked={formData.ellIsPriority}
              onChange={handleChange}
              id='ellIsPriority'
            />
            <label htmlFor='ellIsPriority'>ELL</label>

            <input
              type='checkbox'
              name='ebdIsPriority'
              value={formData.ebdIsPriority}
              checked={formData.ebdIsPriority}
              onChange={handleChange}
              id='ebdIsPriority'
            />
            <label htmlFor='ebdIsPriority'>EBD</label>
          </div>

          <div id='seat-style-form-div'>
            <p>Seating style:</p>
            <input
              type='radio'
              name='seatStyle'
              value={formData.seatAlphabetical}
              checked={formData.seatAlphabetical}
              onChange={handleChange}
              id='seatAlphabetical'
            />
            <label htmlFor='seatAlphabetical'>Alphabetical</label>

            <input
              type='radio'
              name='seatStyle'
              value={formData.seatRandomize}
              checked={formData.seatRandomize}
              onChange={handleChange}
              id='seatRandomize'
            />
            <label htmlFor='seatRandomize'>Random</label>

            <input
              type='radio'
              name='seatStyle'
              value={formData.seatHighLow}
              checked={formData.seatHighLow}
              onChange={handleChange}
              id='seatHighLow'
            />
            <label htmlFor='seatHighLow'>High-Low</label>

            <input
              type='radio'
              name='seatStyle'
              value={formData.seatMaleFemale}
              checked={formData.seatMaleFemale}
              onChange={handleChange}
              id='seatMaleFemale'
            />
            <label htmlFor='seatMaleFemale'>Male-Female</label>
          </div>

          <button type='submit'>Save Changes</button>
        </form>

        {saveConfirmed ? <Alert messages={saveConfirmed} /> : null}

        <div>
          {!seatingConfig && classroomId ? (
            <LoadingSpinner />
          ) : (
            <>
              <div>
                <ClassroomRedirect classroomId={classroomId} />
              </div>
              <div>
                <Classroom
                  seatingConfig={seatingConfig}
                  updateSeatingConfig={updateSeatingConfig}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default ClassroomForm;
