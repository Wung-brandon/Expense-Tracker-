import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.pages';
import AboutPage from './pages/About.pages';
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
import Income from './pages/Income/income.pages';
import Expense from './pages/Expense/Expense.pages';
import Budget from './pages/Budget/Budget.pages';
import Reports from './pages/Reports/Reports.pages';
import { ThemeProvider } from './context/BackgroundContext';
import "./app.css"
import DashboardLayout from './Layout/DashboardLayout';

function App() {
  return (
    <Router>
      <ThemeProvider>
      
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Layout><HomePage /></Layout>} />
          <Route path='/about' element={<Layout><AboutPage /></Layout>} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<Layout><LoginPage /></Layout>} />
          <Route path='/forgot-password' element={<Layout><ForgotPasswordPage /></Layout>} />
          <Route path='/reset-password/:uidb64/:token/' element={<Layout><ResetPasswordPage /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path='/dashboard/income' element={<DashboardLayout><Income /></DashboardLayout>} />
          <Route path='/dashboard/expense' element={<DashboardLayout><Expense /></DashboardLayout>} />
          <Route path='/dashboard/budget' element={<DashboardLayout><Budget /></DashboardLayout>} />
          <Route path='/dashboard/reports' element={<DashboardLayout><Reports /></DashboardLayout>} />
          
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
