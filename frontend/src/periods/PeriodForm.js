import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SeatingApi from "../api";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";

//Gets all periods on mount, returns message if there are none yet
//Creates a list of current periods if they exist, allows user to edit and save edits on click
//Allows user to add new periods and add to aforementioned list
const PeriodForm = () => {
  const { currentUser } = useContext(UserContext);
  const username = currentUser.username;
  const navigate = useNavigate();

  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({
    schoolYear: "",
    title: "",
    number: "",
  });
  const [formData, setFormData] = useState({
    schoolYear: "",
    title: "",
    number: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  useEffect(() => {
    async function getPeriodsOnMount() {
      try {
        let periods = await SeatingApi.getPeriods(username);
        setPeriods(periods);
      } catch (err) {
        console.error("Periods could not be retrieved", err.message);
      }
    }
    getPeriodsOnMount();
  }, [username]);

  const updatePeriod = async (e, period) => {
    e.preventDefault();
    const data = {
      schoolYear: period.schoolYear,
      title: period.title,
      number: period.number,
    };
    let periodId = period.periodId;
    try {
      const updatedPeriod = await SeatingApi.updatePeriod(
        username,
        periodId,
        data
      );
      setPeriods((prevPeriods) => {
        const newPeriods = [...prevPeriods];
        const index = newPeriods.findIndex(
          (period) => period.number === updatedPeriod.number
        );
        newPeriods[index] = updatedPeriod;
        return newPeriods;
      });
      setFormErrors([]);
      setSaveConfirmed(true);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const deletePeriod = async (e, period) => {
    e.preventDefault();
    try {
      await SeatingApi.deletePeriod(username, period.periodId);
      setPeriods((p) => p.filter((p) => p.periodId !== period.periodId));
      setFormErrors([]);
      setSaveConfirmed(true);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const createPeriod = async (e) => {
    e.preventDefault();
    const { schoolYear, title, number } = formData;
    let data = {
      username: username,
      schoolYear: schoolYear,
      title: title,
      number: parseInt(number),
    };
    if (data.number <= 0) {
      return setFormErrors("Period number must be greater than one");
    }
    try {
      const addedPeriod = await SeatingApi.createPeriod(username, data);
      setPeriods([...periods, addedPeriod]);
      setFormData({ schoolYear: "", title: "", number: "" });
      setFormErrors([]);
      setSaveConfirmed(true);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleEdit = (index) => {
    setSelectedPeriod(periods[index]);
  };

  return (
    <div>
      <h2>Periods</h2>
      <div>
        {periods && Object.values(periods).length ? (
          Object.values(periods).map((period, index) => (
            <div key={index}>
              <p>Year: {period.schoolYear}</p>
              <p>title: {period.title}</p>
              <p>Period: {period.number}</p>
              <button
                onClick={() => navigate(`/periods/${period.periodId}`)}>
                Add Students
              </button>
              <button onClick={() => handleEdit(index)}>Edit</button>
            </div>
          ))
        ) : (
          <p>No periods added yet.</p>
        )}
        {selectedPeriod && (
          <React.Fragment key={selectedPeriod.id}>
            <form>
              <label htmlFor='schoolYear'>School Year:</label>
              <input
                type='text'
                name='schoolYear'
                value={selectedPeriod.schoolYear || ""}
                onChange={(e) =>
                  setSelectedPeriod((p) => ({
                    ...p,
                    schoolYear: e.target.value,
                  }))
                }
              />

              <label htmlFor='title'>Class title:</label>
              <input
                type='text'
                name='title'
                value={selectedPeriod.title || ""}
                onChange={(e) =>
                  setSelectedPeriod((p) => ({ ...p, title: e.target.value }))
                }
              />

              <label htmlFor='number'>Period number:</label>
              <input
                type='number'
                name='number'
                value={selectedPeriod.number || ""}
                onChange={(e) =>
                  setSelectedPeriod((p) => ({ ...p, number: e.target.value }))
                }
              />
              <button onClick={(e) => updatePeriod(e, selectedPeriod)}>
                Save
              </button>
              <button onClick={(e) => deletePeriod(e, selectedPeriod)}>
                Delete
              </button>
            </form>
          </React.Fragment>
        )}

        {formErrors.length ? <Alert messages={formErrors} /> : null}
        {saveConfirmed ? (
          <Alert messages={["Changes saved successfully."]} />
        ) : null}
      </div>
      <form id='new-period-form'  onSubmit={createPeriod}>
        <h3>New Period</h3>

        <label htmlFor='schoolYear'>School Year:</label>
        <input
          type='text'
          name='schoolYear'
          placeholder='2023-2024'
          defaultValue={formData.schoolYear}
          onChange={(e) =>
            setFormData((f) => ({ ...f, schoolYear: e.target.value }))
          }
        />

        <label htmlFor='title'>Class title:</label>
        <input
          type='text'
          name='title'
          placeholder='Algebra 1 Honors'
          defaultValue={formData.title}
          onChange={(e) =>
            setFormData((f) => ({ ...f, title: e.target.value }))
          }
        />

        <label htmlFor='number'>Period number:</label>
        <input
          type='number'
          name='number'
          placeholder='5'
          defaultValue={formData.number}
          onChange={(e) =>
            setFormData((f) => ({ ...f, number: e.target.value }))
          }
        />

        <button>Create Period</button>
      </form>
    </div>
  );
};

export default PeriodForm;
