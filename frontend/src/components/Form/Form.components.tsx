import React, { useState } from 'react';
import { Button, TextField, IconButton, InputAdornment, MenuItem, Select, InputLabel, FormControl, TextareaAutosize } from '@mui/material';
import { Box } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface FieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  required?: boolean;
  options?: { label: string; value: string }[]; // For select fields
}

interface FormProps {
  fields: FieldProps[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  submitText: string;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitText }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordToggle = () => setShowPassword(!showPassword);
  const handleConfirmPasswordToggle = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let allFieldsFilled = true;

    fields.forEach(field => {
      if (field.required && !formData.get(field.name)) {
        allFieldsFilled = false;
      }
    });

    if (!allFieldsFilled) {
      toast.warning('All fields are required');
      return;
    }

    onSubmit(e);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form-container"
    >
      {fields.map((field, index) => {
        switch (field.type) {
          case 'select':
            return (
              <FormControl variant="outlined" className="mb-4 mt-1 w-100" key={index}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  label={field.label}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange as React.ChangeEventHandler<HTMLSelectElement>}
                  required={field.required}
                >
                  <MenuItem value=""><em>-----------</em></MenuItem>
                  {field.options?.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          case 'textarea':
            return (
              <TextareaAutosize
                key={index}
                name={field.name}
                value={field.value}
                onChange={field.onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                placeholder={field.label}
                minRows={4}
                className="mb-4 mt-1 w-100"
                required={field.required}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#c4c4c4' }}
              />
            );
          default:
            return (
              <TextField
                key={index}
                label={field.label}
                type={
                  field.name === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : field.name === 'confirmPassword'
                      ? showConfirmPassword
                        ? 'text'
                        : 'password'
                      : field.type
                }
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                variant="outlined"
                size="small"
                className="mb-4 mt-1 w-100"
                required={field.required}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {(field.name === 'password' || field.name === 'confirmPassword') && (
                        <IconButton
                          onClick={
                            field.name === 'password'
                              ? handlePasswordToggle
                              : handleConfirmPasswordToggle
                          }
                          edge="end"
                        >
                          {field.name === 'password' && (showPassword ? <VisibilityOff /> : <Visibility />)}
                          {field.name === 'confirmPassword' && (showConfirmPassword ? <VisibilityOff /> : <Visibility />)}
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            );
        }
      })}
      <Button
        type="submit"
        variant="contained"
        style={{ background: "linear-gradient(to right bottom, #9733ee, #da22ff )" }}
        className="w-100 mt-2"
      >
        {submitText}
      </Button>
    </Box>
  );
};

export default Form;
