import React, { useState, ChangeEvent, useContext, useEffect } from 'react';
import Form from '../components/Form/Form.components';
import loginImg from "../../src/assets/Time-Expense-Tracking-.png";
import { NavLink, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const location = useLocation(); // Hook to access location (for query params)
  const { loginUser } = useContext(AuthContext);

  // Check if the account was just activated
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log("params: " + params)
    if (params.get('account_verified') === 'True') {
      toast.success('Account activated successfully. You can now log in!');
    }
  }, [location]);

  const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (email.length > 0) {
      loginUser(email, password);
      setEmail('');
      setPassword('');
    }
    // Handle login logic here
    console.log({ email, password });
  };

  const fields = [
    { label: 'Email', type: 'email', name: 'email', value: email, onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), required: true },
    { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), required: true }
  ];

  interface Styles {
    forgot: React.CSSProperties 
  }
  
  const style: Styles = {
    forgot: {
      position: 'relative',
      top: -65,
      left: 90
    }
  };

  return (
    <section style={{ backgroundColor: "#c0c0c0", height: "650px" }}>
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="shadow rounded bg-light p-4" style={{ width: '100%', maxWidth: '1000px' }}>
          <div className="row">
            <div className="col-lg-5 text-center mt-4">
              <h2 className="text-center mt-5 title-color">Login</h2>
              <h4 className='text-capitalize'>Welcome back!!</h4>
              <p>Login to your <span className='title-color'>ExpenseEye</span> account and track your expenses</p>
              <Form fields={fields} onSubmit={handleLoginSubmit} submitText="Login" />
              <NavLink to="/forgot-password" className="forgot text-capitalize text-decoration-none" style={style.forgot}>Forgot password?</NavLink>
              <p className='text-capitalize'>Don't have an account? <NavLink className="text-decoration-none" to="/signup">Sign Up</NavLink></p>
            </div>
            <div className="col-lg-7">
              <img src={loginImg} alt="" className='img-fluid'/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
