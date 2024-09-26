import React, { useState, useEffect } from 'react';
import { Button, TextField, IconButton, InputAdornment, MenuItem, Select, InputLabel, FormControl, TextareaAutosize, CircularProgress} from '@mui/material';
import { Box } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface FieldProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  required?: boolean;
  options?: { label: string; value: string }[]; // For select fields
}

interface FormProps {
  fields: FieldProps[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  submitText: string;
  loading?: boolean;
  open?: boolean; 
  initialValues?: Record<string, string | number>; // For pre-filling fields in edit mode
  isEditing?: boolean; // To determine if the form is in edit mode
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitText, loading, initialValues, isEditing }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string | number>>({});
  // console.log('Form loading:', loading);
  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

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
      position="relative" // Add relative positioning for overlay
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
                  onChange={field.onChange}
                  required={field.required}
                >
                  <MenuItem value="All"><em>-----------</em></MenuItem>
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
                onChange={field.onChange}
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
        {loading ? <CircularProgress size={24}/> : submitText}
        
      </Button>
      {/* {loading && (
        
          <Box
            position="fixed" // Changed from absolute to fixed
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(0, 0, 0, 0.5)" // Dark overlay
            zIndex={1300} // Ensure the spinner is on top of other content
          >
            <CircularProgress
              size={50} // Custom size
              color="inherit" // Inherit color from parent, which will be white
              sx={{ color: 'white' }} // Custom color to make it white
            />
          </Box>
        
      )} */}
    </Box>
  );
};

export default Form;
