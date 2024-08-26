import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.pages';
import SignupPage from './pages/signup';
import LoginPage from './pages/loginpage';
import DashboardPage from './pages/Dashboard/Dashboard.pages';
import ForgotPasswordPage from './pages/forgot_password_page';
import ResetPasswordPage from './pages/reset_password_page';
import NotFoundPage from './pages/notFound';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext';
import Layout from './Layout/Layout';
import ProtectedRoute from './utils/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Layout><HomePage /></Layout>} />
          <Route path='/signup' element={<Layout><SignupPage /></Layout>} />
          <Route path='/login' element={<Layout><LoginPage /></Layout>} />
          <Route path='/forgot-password' element={<Layout><ForgotPasswordPage /></Layout>} />
          <Route path='/reset-password' element={<Layout><ResetPasswordPage /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
