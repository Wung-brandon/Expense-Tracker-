import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ButtonComponent from '../Button/Button.component';
import Form from '../../Form/Form.components';
import { useState, useEffect } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 8,
};

interface Option {
  label: string;
  value: string;
}

interface FieldProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  required?: boolean;
  options?: Option[]; // Options for select fields
}

// Define the props for the KeepMountedModal component
interface KeepMountedModalProps {
  title: string;
  buttonText: string;
  fields: FieldProps[];
  onSubmit: (data: { [key: string]: any }) => void;
  open?: boolean;
  onClose?: () => void;
  isEditMode?: boolean; // New prop to indicate edit mode
  initialData?: { [key: string]: any }; // New prop to provide initial data for editing
}

const KeepMountedModal: React.FC<KeepMountedModalProps> = ({
  title,
  buttonText,
  fields,
  onSubmit,
  open: controlledOpen = false,
  onClose = () => {},
  isEditMode = false,
  initialData = {},
}) => {
  const [open, setOpen] = useState(controlledOpen);
  const [formFields, setFormFields] = useState<FieldProps[]>(fields);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    if (isEditMode && initialData) {
      const updatedFields = fields.map((field) => ({
        ...field,
        value: initialData[field.name] || '',
      }));
      setFormFields(updatedFields);
    } else {
      setFormFields(fields);
    }
  }, [isEditMode, initialData, fields]);

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData: { [key: string]: any } = {};
    formFields.forEach(field => {
      formData[field.name] = field.value;
    });

    onSubmit(formData);
    handleClose();
  };

  return (
    <div>
      {!controlledOpen && <ButtonComponent text={buttonText} onClick={handleOpen} />}
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <h4 className='text-center mb-4'>{title}</h4>
          <Form fields={formFields} onSubmit={handleFormSubmit} submitText={buttonText} />
        </Box>
      </Modal>
    </div>
  );
};

export default KeepMountedModal;
