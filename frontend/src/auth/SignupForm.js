import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import Alert from "../common/Alert";

//Signup form;
const SignupForm = ({ signup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    title: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.username.includes(".")) {
      return setFormErrors("Periods may not be included in username");
    }
    let res = await signup(formData);

    //Create null classroom to go along with new user
    if (res.success) {
      navigate("/");
    } else {
      setFormErrors(res.errors);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div>
            <label htmlFor='username'>Username</label>
            <input
              name='username'
              value={formData.username}
              onChange={handleChange}
            />
            <br />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
            <br />
            <div>
              <label htmlFor='title'>Title:</label>
              <input
                type='radio'
                name='title'
                value='Mr.'
                onChange={handleChange}
                checked={formData.title === "Mr."}
              />
              <label htmlFor='Mr'>Mr.</label>
              <input
                type='radio'
                name='title'
                value='Mrs.'
                onChange={handleChange}
                checked={formData.title === "Mrs."}
              />
              <label htmlFor='Mrs.'>Mrs.</label>
              <input
                type='radio'
                name='title'
                value='Ms.'
                onChange={handleChange}
                checked={formData.title === "Ms."}
              />
              <label htmlFor='Ms.'>Ms.</label>
            </div>
            <br />
            <label htmlFor='firstName'>First name</label>
            <input
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
            />
            <br />
            <label htmlFor='lastName'>Last name</label>
            <input
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
            />
            <br />
            <label>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
            <br />
          </div>
          <button>Submit</button>

          {formErrors.length ? <Alert messages={formErrors} /> : null}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
