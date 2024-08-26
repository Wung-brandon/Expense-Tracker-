import React, { ChangeEvent, useState } from 'react';
import Form from '../components/Form/Form.components';
import resetImg from "../../src/assets/forgot2.avif"
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate()

  const handleResetSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {

    event.preventDefault();
    // Handle signup logic here

    console.log({ password, confirmPassword });
  };

  const fields = [
    { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), required: true },
    { label: 'Confirm Password', type: 'password', name: 'confirmPassword', value: confirmPassword, onChange: (e:ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value), required: true }
  ];

  return (
    <section style={{ backgroundColor: "#c0c0c0", height:"650px" }}>
        <div className="d-flex justify-content-center align-items-center h-100 ">
            <div className="shadow rounded bg-light p-4" style={{ width: '100%', maxWidth: '1000px' }}>
                <div className="row">
                    <div className="col-lg-5 mt-5 text-center">
                        <h2 className="text-center mb-2 title-color">Reset Password</h2>
                        
                        <Form fields={fields} onSubmit={handleResetSubmit} navigate={() => navigate("/login")} submitText="Reset Password" />
                        <NavLink to="/login" className="text-center text-capitalize text-decoration-none mt-3">Back to login</NavLink>
                    </div>

                    <div className="col-lg-7">
                        <img src={resetImg} alt="" className='img-fluid'/>
                    </div>

                </div>

                
            </div>
            
            
        </div>
    </section>
     
      

  );
};

export default ResetPasswordPage;
