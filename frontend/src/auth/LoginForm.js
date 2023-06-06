import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import Alert from "../common/Alert";

//Login form; upon submission navigate to homepage
const LoginForm = ({ login }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await login(formData);
    if (res.success) {
      navigate("/");
    }
    setFormErrors(res.errors);
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((l) => ({ ...l, [name]: value }));
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <h2>Log In</h2>
          <label htmlFor='username'>Username</label>
          <input
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Username'
            required
          />
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            autoComplete='current-password'
            required
          />
          <button>Submit</button>

          {formErrors.length ? <Alert messages={formErrors} /> : null}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
