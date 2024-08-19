import React from 'react';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';

interface FieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}

interface FormProps {
  fields: FieldProps[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  submitText: string;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitText }) => {
  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit} className="form-container">
      {fields.map((field, index) => (
        <TextField
          key={index}
          label={field.label}
          type={field.type}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          variant="outlined"
          size="small"
          className="mb-4 mt-1 w-100"
          required={field.required}
        />
      ))}
      <Button
        type="submit"
        variant="contained"
        style={{background: "linear-gradient(to right bottom, #9733ee, #da22ff )"}}
        className="w-100 mt-2"
      >
        {submitText}
      </Button>
    </Box>
  );
};

export default Form;
