import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, TextField, MenuItem, Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxios from '../../utils/useAxios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Datepicker styles

// Budget Categories for Select
const categories = ['Food', 'Transportation', 'Entertainment', 'Education', 'Miscellaneous'];

const Budget = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number | string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByAmount, setFilterByAmount] = useState({ min: '', max: '' });
  
  useEffect(() => {
    fetchBudgetHistory();
    // fetchChartData();
  }, []);

  const axiosInstance = useAxios()
  const fetchBudgetHistory = async () => {
    try {
      const response = await axiosInstance.get('/track/budget/');
      console.log("budget history fetched", response.data);
      setBudgetHistory(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching budget history:', error);
    }
  };

  // const fetchChartData = async () => {
  //   try {
  //     const response = await axiosInstance.get('/api/budget/charts');
  //     setChartData(response.data);
  //   } catch (error) {
  //     console.error('Error fetching chart data:', error);
  //   }
  // };

  const handleBudgetSubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/budget/set', {
        category,
        budgetAmount
      });
      alert('Budget set successfully!');
      fetchBudgetHistory();
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  // const handleSearch = () => {
  //   const filtered = budgetHistory.filter(item => 
  //     item.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //     item.amount >= filterByAmount.min &&
  //     item.amount <= filterByAmount.max
  //   );
  //   setFilteredData(filtered);
  // };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 110 },
    { field: 'period', headerName: 'Period', width: 150 },
    { field: 'date', headerName: 'Date', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteBudget(params.row.id)}
        >
          Delete
        </Button>
      ),
    }
  ];

  const handleDeleteBudget = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/budget/${id}/delete`);
      fetchBudgetHistory();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={4}>
        {/* Budget Form */}
        <Grid item xs={12} md={6}>
          <Box className="card p-3">
            <Typography variant="h5">Set Budget for This Month/Week</Typography>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              margin="normal"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Budget Amount"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleBudgetSubmit} fullWidth>
              Set Budget
            </Button>
          </Box>
        </Grid>

        {/* Budget History Table */}
        <Grid item xs={12}>
          <Box className="card p-3">
            <Typography variant="h5">Budget History</Typography>
            <TextField
              label="Search by Category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              margin="normal"
            />
            <div className="d-flex justify-content-between">
              <TextField
                label="Min Amount"
                value={filterByAmount.min}
                onChange={(e) => setFilterByAmount({ ...filterByAmount, min: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Max Amount"
                value={filterByAmount.max}
                onChange={(e) => setFilterByAmount({ ...filterByAmount, max: e.target.value })}
                margin="normal"
              />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
              />
              {/* <Button variant="contained" onClick={handleSearch}>Filter</Button> */}
            </div>

            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={budgetHistory}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
              />
            </div>
          </Box>
        </Grid>

        {/* Budget Chart */}
        <Grid item xs={12} md={6}>
          <Box className="card p-3">
            <Typography variant="h5">Budget Distribution by Category</Typography>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#FF4560', '#FEB019', '#00E396'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Budget;
