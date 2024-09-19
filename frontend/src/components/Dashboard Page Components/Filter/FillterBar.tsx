import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useThemeBackground } from '../../../context/BackgroundContext';
import "../DarkModeStyles.css"

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterBarProps {
  selectLabel?: string;
  selectValue?: string | number;
  setSelectValue: React.Dispatch<React.SetStateAction<string | number>>;
  selectOptions: FilterOption[];

  minAmount: number | '';
  setMinAmount: React.Dispatch<React.SetStateAction<number | ''>>;
  maxAmount: number | '';
  setMaxAmount: React.Dispatch<React.SetStateAction<number | ''>>;

  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;

  filterButtonText?: string;
  filterClick?: () => void;
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
  const { isDarkMode } = useThemeBackground();

  return (
    <Box 
      className={isDarkMode ? 'custom-dark-mode' : ''}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-evenly', 
        flexWrap: 'wrap', 
        gap: '16px', 
        mt: 2,
        padding: '16px',
        borderRadius: '8px'
      }}
    >
      {/* Select Dropdown for Category or Source */}
      <TextField
        label={selectLabel}
        select
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value as string)}
        sx={{ 
          minWidth: 180,
          backgroundColor: isDarkMode ? '#333' : '#ffffff',
          color: isDarkMode ? '#fff' : '#000',
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#bbb' : '#000',
          },
        }}
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
        onChange={(e) => setMinAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
        sx={{
          minWidth: 150,
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#bbb' : '#000',
          },
        }}
      />

      {/* Max Amount Input */}
      <TextField
        label="Max Amount"
        type="number"
        value={maxAmount}
        onChange={(e) => setMaxAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
        sx={{
          minWidth: 150,
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#bbb' : '#000',
          },
        }}
      />

      {/* Date Range Pickers */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          sx={{
            '& .MuiInputLabel-root': {
            color: isDarkMode ? '#bbb' : '#000',
          },
          }}
          className={isDarkMode ? 'dark-mode' : ''}
          slotProps={{
            textField: {
              variant: 'outlined',
            },
          }}
          components={{ 
            OpenPickerIcon: CalendarTodayIcon 
          }}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          className={isDarkMode ? 'dark-mode' : ''}
          sx={{
            '& .MuiInputLabel-root': {
            color: isDarkMode ? '#bbb' : '#000',
          },
          }}
          slotProps={{
            textField: {
              variant: 'outlined',
            },
          }}
          components={{ 
            OpenPickerIcon: CalendarTodayIcon 
          }}
        />
      </LocalizationProvider>

      {/* Apply Filters Button */}
      <Button 
        onClick={filterClick} 
        variant="contained" 
        sx={{ padding: '8px 16px', backgroundColor: isDarkMode ? '#4a148c' : 'primary'}}
      >
        {filterButtonText}
      </Button>
    </Box>
  );
};

export default FilterBar;
