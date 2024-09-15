import React, { useState, ChangeEvent, useContext } from 'react';
import Form from '../components/Form/Form.components';
import { NavLink, useNavigate} from 'react-router-dom';
import forgot from '../../src/assets/forgotpassword.avif'
import AuthContext from '../context/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');



  const { forgotPassword } = useContext(AuthContext);

  const handleForgotSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // Handle login logic here
    forgotPassword(email);
    setEmail('');
   

  };

  const fields = [
    { label: 'Email', type: 'email', name: 'email', value: email, onChange: (e:ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), required: true },
  ];


  return (
    <section style={{ backgroundColor: "#c0c0c0", height:"650px" }}>
        <div className="d-flex justify-content-center align-items-center  h-100 ">
            <div className="shadow rounded bg-light p-4" style={{ width: '100%', maxWidth: '900px' }}>
                <div className="row">
                    <div className="col-lg-7">
                        <img src={forgot} alt="" className='img-fluid'/>
                    </div>

                    <div className="col-lg-5 text-center m-auto">
                        <h2 className="text-center mt-5 title-color">Forgot Your Password</h2>
                        <h6 className='text-capitalize pt-3'>please enter the email address you'd like your password reset information sent to!!</h6>
                        <Form fields={fields} onSubmit={handleForgotSubmit} submitText="Request Reset Link" />
                        <NavLink to="/login" className="forgot text-capitalize text-decoration-none pt-3">Back to login</NavLink>
                    
                    </div>
                </div>
        

                    
            </div>
            
            
        </div>
    </section>
  );
};

export default ForgotPasswordPage;
