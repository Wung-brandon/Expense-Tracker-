/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
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
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  required?: boolean;
  options?: Option[]; // Options for select fields
}

interface KeepMountedModalProps {
  title: string;
  buttonText: string;
  fields: FieldProps[];
  onSubmit: (data: { [key: string]: any }) => Promise<void>; // Ensure onSubmit returns a promise
  open: boolean; // Controlled open prop
  onClose: () => void; // Controlled close prop
  isEditMode?: boolean; // Indicates edit mode
  initialData?: { [key: string]: any }; // Initial data for editing
}

const KeepMountedModal: React.FC<KeepMountedModalProps> = ({
  title,
  buttonText,
  fields,
  onSubmit,
  open,
  onClose,
  isEditMode = false,
  initialData = {},
}) => {
  const [formFields, setFormFields] = useState<FieldProps[]>(fields);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      const updatedFields = fields.map((field) => ({
        ...field,
        value: initialData[field.name] || '', // Set prefilled data for editing
      }));
      setFormFields(updatedFields);
    } else {
      setFormFields(fields);
    }
  }, [isEditMode, initialData, fields]);

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsLoading(true); // Show spinner when form is submitted

    const formData: { [key: string]: any } = {};
    formFields.forEach(field => {
      formData[field.name] = field.value;
    });

    onSubmit(formData)
      .then(() => {
        onClose(); // Close modal on successful form submit
      })
      .catch((error) => {
        console.error('Form submission error:', error);
      })
      .finally(() => {
        setIsLoading(false); // Hide spinner when submission is complete
      });
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
        <Form 
          fields={formFields}
          onSubmit={handleFormSubmit}
          submitText={buttonText}
          loading={isLoading}
        />
      </Box>
    </Modal>
  );
};

export default KeepMountedModal;
