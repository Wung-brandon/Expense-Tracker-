import React, { useState } from 'react';
import { Button, MenuItem, TextField, Box, Typography } from '@mui/material';
import './filter.css';

interface FilterProps {
  filterType: 'income' | 'expense'; // Type of filter: 'income' or 'expense'
  onApplyFilter: (filters: any) => void; // Function to apply filters
  sourceOptions?: string[]; // Array of options for 'source' (for income)
  categoryOptions?: string[]; // Array of options for 'category' (for expense)
}

const Filter: React.FC<FilterProps> = ({ filterType, onApplyFilter, sourceOptions, categoryOptions }) => {
  const [source, setSource] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [amountRange, setAmountRange] = useState<{ min: number, max: number }>({ min: 0, max: 0 });
  const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });

  // Handle filter submission
  const handleApplyFilter = () => {
    const filters = {
      ...(filterType === 'income' ? { source } : { category }),
      amountRange,
      dateRange
    };
    onApplyFilter(filters); // Pass the selected filters back to the parent component
  };

  return (
    <Box className="filter-container">
      <Typography variant="h6">{filterType === 'income' ? 'Filter Income' : 'Filter Expense'}</Typography>
      {/* Source dropdown for income */}
      {filterType === 'income' && (
        <TextField
          select
          label="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          margin="normal"
        >
          {sourceOptions?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Category dropdown for expenses */}
      {filterType === 'expense' && (
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          margin="normal"
        >
          {categoryOptions?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Amount range inputs */}
      <Box className="amount-range-inputs" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <TextField
          label="Min Amount"
          type="number"
          value={amountRange.min}
          onChange={(e) => setAmountRange({ ...amountRange, min: Number(e.target.value) })}
          margin="normal"
        />
        <TextField
          label="Max Amount"
          type="number"
          value={amountRange.max}
          onChange={(e) => setAmountRange({ ...amountRange, max: Number(e.target.value) })}
          margin="normal"
        />
      </Box>

      {/* Date range inputs */}
      <Box className="date-range-inputs" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <TextField
          label="End Date"
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
      </Box>

      {/* Apply filter button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyFilter}
        fullWidth
        sx={{ mt: 2 }}
      >
        Apply Filter
      </Button>
    </Box>
  );
};

export default Filter;
