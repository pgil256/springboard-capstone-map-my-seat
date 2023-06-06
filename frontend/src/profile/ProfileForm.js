import React, { useState, useContext } from "react";
import SeatingApi from "../api";
import UserContext from "../auth/UserContext";

import Alert from "../common/Alert";

//Profile form
const ProfileForm = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const username = currentUser.username;
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    try {
      const updatedUser = await SeatingApi.saveUserProfile(
        username,
        profileData
      );
      setCurrentUser(updatedUser);
      setFormData((f) => ({ ...f, password: "" }));
      setFormErrors([]);
      setSaveConfirmed('Profile successfully updated');
    } catch (err) {
      console.error(err);
      setFormErrors([err.message]);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  };

  return (
    <div>
      <div>
        <form id='profile' onSubmit={handleSubmit}>
          <h2>Profile</h2>
          <div>
            <label>Username</label>
            <p>{username}</p>

            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              name='LastName'
              value={formData.lastName}
              onChange={handleChange}
            />
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              name='LastName'
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <button>Save</button>
          {formErrors.length ? <Alert messages={formErrors} /> : null}
          {saveConfirmed.length ? <Alert messages={saveConfirmed} /> : null}
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
