/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { InputAdornment, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface FilterBarProps {
  filterSource: string;
  setFilterSource: React.Dispatch<React.SetStateAction<string>>;
  filterMinAmount: number | '';
  setFilterMinAmount: React.Dispatch<React.SetStateAction<number | ''>>;
  filterMaxAmount: number | '';
  setFilterMaxAmount: React.Dispatch<React.SetStateAction<number | ''>>;
  filterStartDate: Date | null;
  setFilterStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  filterEndDate: Date | null;
  setFilterEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  filterButtonText?: string;
  filterClick?: any;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterSource,
  setFilterSource,
  filterMinAmount,
  setFilterMinAmount,
  filterMaxAmount,
  setFilterMaxAmount,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterButtonText = "Apply Filters",
  filterClick
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-evenly', 
        flexWrap: 'wrap', 
        gap: '16px', 
        mt: 2 
      }}
    >
      <TextField
        label="Source"
        select
        value={filterSource}
        onChange={(e) => {
          e.preventDefault();  // Prevent any default form submission behavior
          setFilterSource(e.target.value as string);
        }}
        sx={{ minWidth: 180 }} // Adjust the width of the select field
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="SALARY">Salary</MenuItem>
        <MenuItem value="BUSINESS">Business</MenuItem>
        <MenuItem value="SIDE HUSTLE">Side Hustle</MenuItem>
        <MenuItem value="INVESTMENTS">Investments</MenuItem>
        <MenuItem value="INHERITANCE">Inheritance</MenuItem>
        <MenuItem value="GIFTS">Gifts</MenuItem>
        <MenuItem value="OTHERS">Others</MenuItem>
      </TextField>

      <TextField
        label="Min Amount"
        type="number"
        value={filterMinAmount}
        onChange={(e) => {
          e.preventDefault();
          setFilterMinAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
        }}
        sx={{ minWidth: 150 }}
      />

      <TextField
        label="Max Amount"
        type="number"
        value={filterMaxAmount}
        onChange={(e) => {
          e.preventDefault();
          setFilterMaxAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
        }}
        sx={{ minWidth: 150 }}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={filterStartDate}
          onChange={(date) => setFilterStartDate(date)}
          renderInput={(params:any) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 180 }}
            />
          )}
        />
        
        <DatePicker
          label="End Date"
          value={filterEndDate}
          onChange={(date) => setFilterEndDate(date)}
          renderInput={(params:any) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 180 }}
            />
          )}
        />
      </LocalizationProvider>

      <button onClick={filterClick} type='button' className='btn btn-primary' style={{ padding: '8px 16px' }}>
        {filterButtonText}
      </button>
    </Box>
  );
};

export default FilterBar;
