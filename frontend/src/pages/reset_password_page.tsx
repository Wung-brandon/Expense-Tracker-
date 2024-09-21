import React, { ChangeEvent, useState, useContext } from 'react';
import Form from '../components/Form/Form.components';
import resetImg from "../../src/assets/forgot2.avif"
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {toast} from "react-toastify"

const ResetPasswordPage: React.FC = () => {
  const {uidb64, token} = useParams<{uidb64: string, token:string}>()
  const [newPassword, setPassword] = useState<string>('');
  const [confirm_password, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)

  const {resetPassword} = useContext(AuthContext)  


  const handleResetSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {

    event.preventDefault();
    setLoading(true)
    try{
      if (newPassword != confirm_password){
        toast.error("Passwords do not match")
      }
      else if (newPassword.length < 6 || confirm_password.length < 6){
        toast.warning("Password is too short")
      }
      else{
        await resetPassword(uidb64, token, newPassword, confirm_password)
        setPassword("")
        setConfirmPassword("")
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('password reset failed, please try again.');
  }
  finally{
    setLoading(false)
  }
}

console.log("Password reset load", loading)

  const fields = [
    { label: 'Password', type: 'password', name: 'password', value: newPassword, onChange: (e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), required: true },
    { label: 'Confirm Password', type: 'password', name: 'confirmPassword', value: confirm_password, onChange: (e:ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value), required: true }
  ];

  return (
    <section style={{ backgroundColor: "#c0c0c0", height:"650px" }}>
        <div className="d-flex justify-content-center align-items-center h-100 ">
            <div className="shadow rounded bg-light p-4" style={{ width: '100%', maxWidth: '1000px' }}>
                <div className="row">
                    <div className="col-lg-5 mt-5 text-center">
                        <h2 className="text-center mb-2 title-color">Reset Password</h2>
                        
                        <Form fields={fields} onSubmit={handleResetSubmit}  submitText="Reset Password" loading={loading} />
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
