import React from 'react';
import Navbar from '../components/Navbar/Navbar.components';
import Footer from '../components/Footer/Footer.components';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
