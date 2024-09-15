import React, { useState, ChangeEvent, useContext, useEffect } from 'react';
import Form from '../components/Form/Form.components';
import loginImg from "../../src/assets/Time-Expense-Tracking-.png";
import { NavLink, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Divider } from '@mui/material';
// import "./login.css"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const location = useLocation(); // Hook to access location (for query params)
  const [loading, setLoading] = useState<boolean>(false)
  const { loginUser, requestVerificationResend } = useContext(AuthContext);

  // Check if the account was just activated
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('account_verified') === 'True') {
      toast.success('Account activated successfully. You can now log in!');
    }
  }, [location]);

  const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading spinner
  
    // Define a function to stop the spinner
    const stopLoading = () => {
      setLoading(false);
    };
  
    // Set a timeout to stop the spinner after a fixed duration (e.g., 30 seconds)
    const timeout = setTimeout(stopLoading, 30000); // 30 seconds
  
    try {
      if (email.length > 0 && password.length > 0) {
        await loginUser(email, password); // Wait for the login process to complete
        setEmail(''); // Clear email after submission
        setPassword(''); // Clear password after submission
        // Optionally, handle successful login here
      } else {
        toast.warning('Please enter both email and password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed, please try again.');
    } finally {
      // Clear the timeout to prevent it from firing if the login completes before 30 seconds
      clearTimeout(timeout);
      // Ensure loading is stopped after the login attempt is complete
      stopLoading();
    }
  
    console.log({ email, password });
  };
  
  // function handleResend(){
  //   requestVerificationResend(email)
  // }

  const fields = [
    { label: 'Email', type: 'email', name: 'email', value: email, onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), required: true },
    { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), required: true }
  ];

  interface Styles {
    forgot: React.CSSProperties;
  }

  const style: Styles = {
    forgot: {
      position: 'relative',
      top: -70,
      left: 0,
      textAlign: 'right',
      marginBottom:"5px"
    },
  };

  return (
    <section className="login-section" style={{ backgroundColor: "#f5f5f5", padding:"20px" }}>
      <div className="container d-flex justify-content-center align-items-center py-4 p-sm-0">
        <div className="shadow-lg rounded bg-white p-4" style={{ width: '100%', maxWidth: '900px' }}>
          <div className="row">
            <div className="col-lg-5 col-md-12 text-center m-auto">
              <h2 className="text-center mt-5 title-color">Login</h2>
              <h4 className='text-capitalize'>Welcome back!!</h4>
              <p>Login to your <span className='title-color'>ExpenseEye</span> account and track your expenses</p>
              <Form fields={fields} onSubmit={handleLoginSubmit} submitText="Login" loading={loading} />
              <NavLink to="/forgot-password" className="forgot text-capitalize text-decoration-none d-block mt-2" style={style.forgot}>Forgot password?</NavLink>
              {/* <Divider orientation="horizontal" variant="middle" sx={{ margin: '10px 0', backgroundColor: '#000' }}/> */}
              {/* <p className='text-center'><NavLink to="" style={{textDecoration: "none"}} onClick={handleResend}>Resend Verification Link</NavLink></p> */}
              <p className='text-capitalize'>Don't have an account? <NavLink className="text-decoration-none" to="/signup">Sign Up</NavLink></p>
            </div>
            <div className="col-lg-7 col-md-12">
              <img src={loginImg} alt="Login" className='img-fluid mt-3' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
