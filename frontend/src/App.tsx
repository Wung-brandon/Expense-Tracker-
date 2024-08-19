import Footer from './components/Footer/Footer.components';
import Navbar from './components/Navbar/Navbar.components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.pages';
import SignupPage from './pages/signup';
import LoginPage from './pages/loginpage';


function App() {
  return (
    
      <Router>
        <Navbar />
      
          <Routes>
            <Route index path='/' element={<HomePage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        
        <Footer />
      </Router>
    
  );
}

export default App;
