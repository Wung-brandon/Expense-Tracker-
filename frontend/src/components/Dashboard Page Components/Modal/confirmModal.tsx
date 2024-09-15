import React from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  loading?: boolean; // New prop to control spinner visibility
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  handleClose,
  handleConfirm,
  loading, // Destructure the new prop
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="h2">
          Confirm Delete
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Are you sure you want to delete this item?
        </Typography>
        
        {/* Show spinner if loading is true */}
        {loading ? (
          <Box 
              sx={{ 
                  marginTop:"4rem", 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  backgroundColor:"rgba(0, 0, 0, 0.5)"
                }}
          >
            <CircularProgress 
              size={50} // Custom size
              color="inherit" 
              sx={{ color: 'white' }}
            />
          </Box>
        ) : (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="error" onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
