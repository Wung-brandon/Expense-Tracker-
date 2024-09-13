/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { InputAdornment, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterBarProps {
  selectLabel?: string;
  selectValue: string | number;
  setSelectValue: React.Dispatch<React.SetStateAction<string | number>>;
  selectOptions: FilterOption[]; // Options for the select menu

  minAmount: number | '';
  setMinAmount: React.Dispatch<React.SetStateAction<number | ''>>;
  maxAmount: number | '';
  setMaxAmount: React.Dispatch<React.SetStateAction<number | ''>>;

  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;

  filterButtonText?: string;
  filterClick?: any;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectLabel = "Category",
  selectValue,
  setSelectValue,
  selectOptions,

  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,

  startDate,
  setStartDate,
  endDate,
  setEndDate,

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
      {/* Select Dropdown for Category or Source */}
      <TextField
        label={selectLabel}
        select
        value={selectValue}
        onChange={(e) => {
          e.preventDefault();  
          setSelectValue(e.target.value as string);
        }}
        sx={{ minWidth: 180 }}
      >
        {selectOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Min Amount Input */}
      <TextField
        label="Min Amount"
        type="number"
        value={minAmount}
        onChange={(e) => {
          e.preventDefault();
          setMinAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
        }}
        sx={{ minWidth: 150 }}
      />

      {/* Max Amount Input */}
      <TextField
        label="Max Amount"
        type="number"
        value={maxAmount}
        onChange={(e) => {
          e.preventDefault();
          setMaxAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
        }}
        sx={{ minWidth: 150 }}
      />

      {/* Date Range Pickers */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          renderInput={(params: any) => (
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
          value={endDate}
          onChange={(date) => setEndDate(date)}
          renderInput={(params: any) => (
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

      {/* Apply Filters Button */}
      <button onClick={filterClick} type='button' className='btn btn-primary' style={{ padding: '8px 16px' }}>
        {filterButtonText}
      </button>
    </Box>
  );
};

export default FilterBar;
