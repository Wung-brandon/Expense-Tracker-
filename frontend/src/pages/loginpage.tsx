import React, { useState, ChangeEvent } from 'react';
import Form from '../components/Form/Form.components';
import loginImg from "../../src/assets/Time-Expense-Tracking-.png"
import { NavLink, useNavigate} from 'react-router-dom';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate()

  const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  const fields = [
    { label: 'Email', type: 'email', name: 'email', value: email, onChange: (e:ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), required: true },
    { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), required: true }
  ];

  const forgot = {
    position : "relative",
    top : -65,
    left : 90
  }

  return (
    <section style={{ backgroundColor: "#c0c0c0", height:"650px" }}>
        <div className="d-flex justify-content-center align-items-center  h-100 ">
            <div className="shadow rounded bg-light p-4" style={{ width: '100%', maxWidth: '1000px' }}>
                <div className="row">
                    <div className="col-lg-5 text-center mt-4">
                        <h2 className="text-center mt-5 title-color">Login</h2>
                        <h4 className='text-capitalize'>Welcome back!!</h4>
                        <p>login to your <span className='title-color'>ExpenseEye</span> account and track your expenses</p>
                        <Form fields={fields} onSubmit={handleLoginSubmit} navigate={() => navigate("/dashboard")} submitText="Login" />
                        <NavLink to="" className="forgot text-capitalize text-decoration-none" style={forgot}>forgot password?</NavLink>
                        <p className='text-capitalize'>don't have an account? <NavLink className="text-decoration-none" to="/signup">SignUp</NavLink></p>
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
