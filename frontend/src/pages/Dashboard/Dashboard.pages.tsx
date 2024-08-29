// import { useEffect, useState } from "react";
import Sidebar from "../../components/Dashboard Page Components/Sidebar/Sidebar.components";
import Widgets from "../../components/Dashboard Page Components/Widgets/Widgets.components";
import Income from "../Income/income.pages";
import './DashboardPage.css'; // Ensure this file handles any additional styles
// import useAxios from "../../utils/useAxios";
// import AuthContext from "../../context/AuthContext";
// import { useContext } from "react";
// import { toast } from 'react-toastify';
// import { CircularProgress } from '@mui/material';
import { Outlet } from "react-router-dom";

function DashboardPage() {
  // const axiosInstance = useAxios();
  // const { authTokens } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [userProfile, setUserProfile] = useState<any>(null);
  // const [loading, setLoading] = useState(true);

  // Fetch user profile function
  // const fetchUserProfile = async () => {
  //   if (!authTokens) {
  //     toast.error("No authentication token available.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axiosInstance.get("/user/profile/", {
  //       headers: {
  //         Authorization: `Bearer ${authTokens.access}`,
  //       },
  //     });
  //     if (response.data && response.data.results.length > 0) {
  //       // console.log(response.data.results[0])
  //       setUserProfile(response.data.results[0]); 
  //     } else {
  //       toast.error("User profile not found.");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to fetch user profile.");
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, [authTokens]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
       
        {/* <Income /> */}

      </main>
      <Outlet />
    </div>
  );
}

export default DashboardPage;


        {/* <div className="user-profile mt-5">
          {loading ? (
            <div className="spinner-container">
              <CircularProgress />
            </div>
          ) : userProfile ? (
            <div>
              <h2>Welcome, {userProfile.full_name ? userProfile.full_name : userProfile.user || ""}</h2>
              <p>Name: {userProfile.user}</p>
              <p>Email: {userProfile.email}</p>
              <p>Gender:{userProfile.gender}</p>
              <p>Location: {userProfile.location}</p>
              <p>Phone: {userProfile.phone_number}</p>
              <p>Bio: {userProfile.bio}</p>
              <img src={userProfile.profile_img} alt="Profile" />
             
            </div>
          ) : (
            <p>User profile could not be loaded.</p>
          )}
        </div> */}