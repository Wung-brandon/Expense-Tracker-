import React, { ChangeEvent, useState, useContext } from 'react';
import Form from '../components/Form/Form.components';
import signImg from "../../src/assets/expense-tracker-app.png";
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from "react-toastify";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm_password, setConfirmPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const { signUpUser } = useContext(AuthContext);

  const handleSignupSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (password !== confirm_password) {
      toast.error('Passwords do not match');
      return;
    } else {
      signUpUser(username, gender, email, password, confirm_password);
      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setGender("")
      
    }
    console.log({ username, email, password, gender, confirm_password });
  };

  const fields = [
    { label: 'Username', type: 'text', name: 'username', value: username, onChange: (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value), required: true },
    { label: 'Email', type: 'email', name: 'email', value: email, onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), required: true },
    { label: 'Gender', type: 'select', name: 'gender', value: gender, onChange: (e: ChangeEvent<HTMLSelectElement>) => setGender(e.target.value), required: true },
    { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), required: true },
    { label: 'Confirm Password', type: 'password', name: 'confirmPassword', value: confirm_password, onChange: (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value), required: true }
  ];

  return (
    <section style={{ backgroundColor: "#c0c0c0", height: "100vh" }}>
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="shadow rounded bg-light p-4" style={{ width: '100%', maxWidth: '950px' }}>
          <div className="row">
            <div className="col-lg-7">
              <img src={signImg} alt="" className='img-fluid' />
            </div>
            <div className="col-lg-5 mt-5">
              <h2 className="text-center mb-2 title-color">Signup</h2>
              <p className='text-capitalize'>Create an account with <span className='title-color'>ExpenseEye</span> and track your expenses</p>
              <Form fields={fields} onSubmit={handleSignupSubmit} submitText="Signup" />
              <p className='text-capitalize mt-3'>already have an account? <NavLink className="text-decoration-none" to="/login">Login</NavLink></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
