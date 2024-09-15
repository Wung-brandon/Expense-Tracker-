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
  open: boolean; // Controlled open prop (removed default)
  onClose: () => void; // Controlled close prop
  isEditMode?: boolean; // Indicates edit mode
  initialData?: { [key: string]: any }; // Initial data for editing
}

const KeepMountedModal: React.FC<KeepMountedModalProps> = ({
  title,
  buttonText,
  fields,
  onSubmit,
  open, // Remove the controlledOpen default
  onClose,
  isEditMode = false,
  initialData = {},
}) => {
  const [formFields, setFormFields] = useState<FieldProps[]>(fields);

  useEffect(() => {
    // Update formFields if in edit mode and initialData exists
    if (isEditMode && initialData) {
      const updatedFields = fields.map((field) => ({
        ...field,
        value: initialData[field.name] || '', // Set prefilled data for editing
      }));
      setFormFields(updatedFields);
    } else {
      // Reset fields for add mode
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
    onClose(); // Close modal on form submit
  };

  // Handle form field changes and update formFields state
  const handleFieldChange = (name: string, value: string | number) => {
    setFormFields(prevFields =>
      prevFields.map(field =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  return (
    <Modal
      keepMounted
      open={open} // Controlled by parent component
      onClose={onClose} // Controlled by parent component
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <h4 className='text-center mb-4'>{title}</h4>
        {/* Pass updated fields and handle form changes */}
        <Form 
          fields={formFields.map(field => ({
            ...field,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
              handleFieldChange(field.name, e.target.value), // Handle field change
          }))}
          onSubmit={handleFormSubmit}
          submitText={buttonText}
        />
      </Box>
    </Modal>
  );
};

export default KeepMountedModal;
