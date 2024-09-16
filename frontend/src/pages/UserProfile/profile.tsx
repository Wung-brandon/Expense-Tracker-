import React, { useState, useEffect } from 'react';
import { Avatar, Button, Dialog, DialogTitle, DialogContent, Typography, Grid, Paper } from '@mui/material';
import EditProfileForm from '../../components/Form/profileForm';
import useAxios from '../../utils/useAxios';
import './profile.css'; // Use for additional custom styling

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const axiosInstance = useAxios();

  const fetchUserProfile = async () => {
    const response = await axiosInstance.get("/user/profile/");
    const profileInfo = response.data.results[0];
    setUserProfile(profileInfo);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="container profile-page d-flex justify-content-center">
      <Paper elevation={3} className="shadow p-4 w-100 mt-5" style={{ maxWidth: '800px' }}>
        {userProfile ? (
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4} className="text-center">
              {userProfile.profile_img ? (
                <Avatar
                  alt={userProfile.full_name}
                  src={userProfile.profile_img}
                  sx={{ width: 200, height: 200, margin: '0 auto' }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    margin: '0 auto',
                    backgroundColor: '#6A0DAD',
                    fontSize: '4rem',
                  }}
                >
                  {userProfile.email.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {userProfile.full_name}
              </Typography>
              <Typography variant="body1"><strong>Email: </strong>{userProfile.email}</Typography>
              <Typography variant="body1"><strong>Location: </strong>{userProfile.location || "Not specified"}</Typography>
              <Typography variant="body1"><strong>Phone: </strong>{userProfile.phone_number || "Not specified"}</Typography>
              <Typography variant="body1"><strong>Gender: </strong>{userProfile.gender || "Not specified"}</Typography>
              <Typography variant="body1"><strong>Bio: </strong>{userProfile.bio || "No bio available"}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditProfile}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h5" align="center">No data found</Typography>
        )}
      </Paper>

      {/* Modal for editing profile */}
      <Dialog open={openModal} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {userProfile && (
            <EditProfileForm
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              closeModal={handleModalClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
