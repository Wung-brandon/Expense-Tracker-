/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import useAxios from '../../utils/useAxios';
import { toast } from 'react-toastify';
import { useUser } from '../../context/UserProfileContext';

const EditProfileForm: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { userProfile, setUserProfile, fetchUserProfile } = useUser(); // Get userProfile from context
  const [formData, setFormData] = useState({
    id: userProfile?.id || '',
    full_name: userProfile?.full_name || '',
    location: userProfile?.location || '',
    phone_number: userProfile?.phone_number || '',
    bio: userProfile?.bio || '',
    gender: userProfile?.gender || '',
    email: userProfile?.email || '',
    profile_img: null,
  });

  const axiosInstance = useAxios();

  useEffect(() => {
    if (userProfile) {
      // Update form data if userProfile is updated
      setFormData({
        id: userProfile.id,
        full_name: userProfile.full_name || '',
        location: userProfile.location || '',
        phone_number: userProfile.phone_number || '',
        bio: userProfile.bio || '',
        gender: userProfile.gender || '',
        email: userProfile.email || '',
        profile_img: null,
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, profile_img: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('full_name', formData.full_name);
    form.append('location', formData.location);
    form.append('phone_number', formData.phone_number);
    form.append('bio', formData.bio);
    form.append('email', formData.email);
    form.append('gender', formData.gender);

    if (formData.profile_img) {
      form.append('profile_img', formData.profile_img);
    }

    try {
      const response = await axiosInstance.put(`/user/profile/${formData.id}/`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUserProfile(response.data); // Update the context with the new profile data
        fetchUserProfile(); // Optionally refetch to make sure everything is updated
        toast.success('Profile updated successfully');
        closeModal();
      } else {
        toast.error('Profile update failed');
      }
    } catch (error: any) {
      console.error('Profile update failed', error.response || error);
      if (error.response?.data) {
        toast.error(error.response.data.detail || 'An error occurred while updating the profile');
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        width: '100%',
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            label="Gender"
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Bio"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel htmlFor="profile_img">Profile Image</InputLabel>
          <input
            id="profile_img"
            name="profile_img"
            type="file"
            onChange={handleImageChange}
            style={{ marginTop: '10px' }}
          />
        </FormControl>

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditProfileForm;
