import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  handleClose,
  handleConfirm,

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
        }}
      >
        <Typography variant="h6" component="h2">
          Confirm Delete
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Are you sure you want to delete this item?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;




