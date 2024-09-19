/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import PieChart from '../../components/Dashboard Page Components/Chart/Chart';
import useAxios from '../../utils/useAxios';
import TotalCard from '../../components/Dashboard Page Components/Widgets/Widgets.components';
import KeepMountedModal from '../../components/Dashboard Page Components/Modal/Modal.component';
import { toast } from 'react-toastify';
import DataTable from '../../components/Dashboard Page Components/Table/Table';
import ConfirmationModal from '../../components/Dashboard Page Components/Modal/confirmModal';
import { MoneyOff } from '@mui/icons-material';
import SearchBar from '../../components/Dashboard Page Components/Search/SearchBar';
import FilterBar from '../../components/Dashboard Page Components/Filter/FillterBar';
import ButtonComponent from '../../components/Dashboard Page Components/Button/Button.component';
import { Typography } from '@mui/material';
// import { useThemeBackground } from '../../context/BackgroundContext';

interface Data {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const Expense: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [expenseData, setExpenseData] = useState<Data[]>([]);
  const [originalExpenseData, setOriginalExpenseData] = useState<Data[]>([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Data | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState<boolean>(false);

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  // const [totalExpense, setTotalExpense] = useState<number>(0);

  // const {isDarkMode, toggleTheme} = useThemeBackground()
  const [searchText, setSearchText] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterMinAmount, setFilterMinAmount] = useState<number | ''>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [selected, setSelected] = useState<number[]>([]);

  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = () => {
      axiosInstance.get('/userstats/monthly-summary/')
        .then(response => {
          const responseData = response.data.monthly_summary;
          
          const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in 'YYYY-MM' format

          // Find the summary for the current month
          const currentMonthSummary = responseData.find((item: any) => item.month === currentMonth);

          if (currentMonthSummary) {
            // Set total income for the current month
            setTotal(currentMonthSummary.expenses);
            setTotalIncome(currentMonthSummary.income)
            setTotalBudget(currentMonthSummary.budget)
            // console.log("totals", currentMonthSummary)
            // console.log("total budget", currentMonthSummary.budget)
            // Extract income sources and amounts
            const categories = currentMonthSummary.expense_categories.map((category: any) => category.category);
            const amounts = currentMonthSummary.expense_categories.map((category: any) => category.total_amount);

            // Set data for chart or display
            setLabels(categories);
            setData(amounts);
          } else {
              // If no data for the current month, set income and chart to empty states
              setTotal(0); // Set total income to 0
              setLabels([]); // Clear chart labels
              setData([]); // Clear chart data
              console.log('No data available for the current month.');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };

    // Fetch data every second
    const intervalId = setInterval(fetchData, 1000); // 1000ms = 1 second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array so this runs once when the component mounts


  // console.log("total budget", totalBudget)
  const handleExpenseSubmit = async (formData: { [key: string]: any }) => {
    if (typeof formData.amount === 'string') {
      formData.amount = parseFloat(formData.amount);
      if (formData.amount > totalIncome){
        // console.log("expenses cannot exceed total income")
        toast.warning("Expenses cannot exceed total income")
      }
      if (formData.amount < 0){
        toast.warning("Expense cannot be negative")
      }
      else if (formData.amount > totalBudget || formData.amount + total > totalBudget){
        toast.warning("Expenses Cannot Exceed The Allocated Budget Set For The Month")
      }
    }

    if (formData.date) {
      formData.date = new Date(formData.date).toISOString().split('T')[0];
    }

    // Check if we're in edit mode or add mode
    if (editMode) {
      // Update income logic
      await axiosInstance.put(`/track/expense/${editData?.id}/`, formData)
        .then(() => {
          toast.success("Expense updated successfully");
          resetForm(); // Clear form after successful edit
          fetchAllData(); // Refresh data
        })
        .catch(error => {
          toast.error(`Error updating expense: ${error.response?.data?.message || error.message}`);
        });
    } else {
      // Add new income logic
      await axiosInstance.post('/track/expense/', formData)
        .then(() => {
          toast.success("Expense added successfully");
          resetForm(); // Clear form after successful add
          fetchAllData(); // Refresh data
        })
        .catch(error => {
          // toast.error(`Error adding expense: ${error.response?.data?.message || error.message}`);
          console.log(`Error adding expense: ${error.response?.data?.message || error.message}`);
        });
    }
  
    setModalOpen(false); 
  };

  const resetForm = () => {
      setAmount("")
      setDescription("")
      setDate("")
      setCategory("")
      setEditMode(false);
      setEditData(null);
  }
  const expenseFields = [
    {
      label: 'Category',
      type: 'select',
      name: 'category',
      value: category,
      onChange: (e: React.ChangeEvent<{ value: unknown }>) => setCategory(e.target.value as string), 
      required: true,
      options: [
        { label: 'FOOD', value: 'FOOD' },
        { label: 'TRANSPORTATION', value: 'TRANSPORTATION' },
        { label: 'HOUSING', value: 'HOUSING' },
        { label: 'INSURANCE', value: 'INSURANCE' },
        { label: 'ENTERTAINMENT', value: 'ENTERTAINMENT' },
        { label: 'GIFTS', value: 'GIFTS' },
        { label: 'OTHERS', value: 'OTHERS' },
        { label: 'DEBTS', value: 'DEBTS' },
        { label: 'EDUCATION', value: 'EDUCATION' },
        { label: 'PERSONAL CARE', value: 'PERSONAL CARE' },
        { label: 'ONLINE SERVICES', value: 'ONLINE SERVICES' },
        { label: 'CLOTHING', value: 'CLOTHING' },
        { label: 'HEALTH AND WELLNESS', value: 'HEALTH AND WELLNESS' },
      ],
    },
    {
      label: 'Description',
      type: 'textarea',
      name: 'description',
      value: description,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value), 
      required: true,
    },
    {
      label: 'Amount',
      type: 'number',
      name: 'amount',
      value: amount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value), 
      required: true,
    },
    // {
    //   label: 'Date',
    //   type: 'date',
    //   name: 'date',
    //   value: date,
    //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value),
    //   required: true,
    // },
  ];

  const columns = [
    { id: 'id', label: 'Id', numeric: true },
    { id: 'amount', label: 'Amount', numeric: true },
    { id: 'date', label: 'Date', numeric: false },
    { id: 'category', label: 'Category', numeric: false },
    { id: 'description', label: 'Description', numeric: false },
  ];

  useEffect(() => {
    fetchAllData();
  }, [page, rowsPerPage]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/track/expense/?page=${page + 1}&size=${rowsPerPage}`);
      const responseData = response.data;
      setOriginalExpenseData(responseData.results)
      setExpenseData(responseData.results);
      setCount(responseData.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    fetchAllData();
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchAllData()
  };

  const handleEdit = (row: Data) => {
    setEditMode(true);
    setEditData(row);
    setCategory(row.category);
    setDescription(row.description);
    setAmount(row.amount);
    setDate(row.date);
    setModalOpen(true);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = expenseData.map((item) => item.id as number);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleBatchDelete = async () => {
    try {
      await Promise.all(selected.map((id) => axiosInstance.delete(`/track/expense/${id}/`)));
      toast.success('Successfully deleted');
      setOpen(false)
      setSelected([]);
      fetchAllData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleCancelDelete = () => {
    setOpen(false);
    setSelected([]);
  };


  const closeModal = () => {
    setEditMode(false);
    setEditData(null);
    setModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;

  const handleFilter = async () => {
    const params: Record<string, any> = {};
  
    // Add your filters (source, amount, dates)
    if (filterCategory && filterCategory !== 'ALL') params.category = filterCategory;
    if (filterMinAmount !== '') params['amount__gt'] = filterMinAmount;
    if (filterMaxAmount !== '') params['amount__lt'] = filterMaxAmount;
    if (filterStartDate) params['date__gte'] = filterStartDate.toISOString().split('T')[0];
    if (filterEndDate) params['date__lte'] = filterEndDate.toISOString().split('T')[0];
  
    // Set pagination params
    params.page = 1;
    params.size = 10;  // Adjust according to your pagination setup
  
    try {
      const response = await axiosInstance.get('/track/expense/', { params });
      const paginatedData = response.data.results || response.data;
  
      // Log the paginated data to inspect it
      console.log("Paginated Data: ", JSON.stringify(paginatedData, null, 2));
  
      if (Array.isArray(paginatedData)) {
        
        setExpenseData(paginatedData);
        
       

      } else {
        console.error('Received data is not an array');
      }
  
      // Clear the filters after applying
      setCategory("")
      setFilterMinAmount("");
      setFilterMaxAmount("");
      setFilterStartDate(null);
      setFilterEndDate(null);
    } catch (error) {
      console.error('Error fetching filtered income:', error);
    }
    
  };

  function handleSearch(){
    const filtered = originalExpenseData.filter(item =>
      item.category.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.amount.toString().includes(searchText) ||
      item.date.includes(searchText)
    );

    setExpenseData(filtered);
    setSearchText("")
  }

  const handleAddExpenseClick = () => {
    resetForm(); // Clear fields before opening
    setEditMode(false); // Set to add mode
    setModalOpen(true); // Open modal
  };

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", {month: "long"})

  return (
    <div className="income" style={{margin: "7rem"}}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-4">
        <h2 className="text-center mb-3 mb-sm-0">Expense Summary</h2>
        <ButtonComponent text='Add Expense' onClick={handleAddExpenseClick}/>
        <KeepMountedModal 
          title={editMode ? "Edit Expense" : "Add Expense"} 
          buttonText={editMode ? "Update Expense" : "Add Expense"}
          fields={expenseFields}
          onSubmit={handleExpenseSubmit}
          open={modalOpen}
          onClose={closeModal}
          isEditMode={editMode}
          initialData={editData}
        />
      </div>
      <div className="row shadow" style={{borderRadius:"1.5rem"}}>
        <div className="col-12 col-md-6 mb-4 mb-md-0 mt-5 mb-3 rounded">
          <TotalCard 
              title={`Total Expenses For ${currentMonth}`} 
              total={total} 
              icon={MoneyOff} 
              backgroundColor="#FFEBEE"
              hoverBackgroundColor="#F44336"  
              iconColor="#D32F2F"
              hoverIconColor="#FFFFFF"
          />
        </div>
        <div className="col-12 col-md-6">
          {total === 0 ? <Typography 
                              color='error' 
                              sx={{fontSize:"1.5rem", textAlign:"center", marginTop:"7rem"}}
                          >No Expense Category</Typography> : 
            <PieChart data={data} labels={labels} title={`Expense Distribution By Category In ${currentMonth}`} />
          } 
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <DataTable 
            columns={columns} 
            data={expenseData}
            page={page}
            text={<SearchBar 
                      placeholder='Search by Categories, Description, Date and Amount'
                      value={searchText}
                      onChange={(e:any) => setSearchText(e.target.value)}
                      onClick={handleSearch}
                  />}
            filterData={<FilterBar
              selectLabel="Category"
              selectValue={filterCategory}
              setSelectValue={setFilterCategory}
              selectOptions={[
                { label: "ALL", value: "ALL" },
                { label: 'FOOD', value: 'FOOD' },
                { label: 'TRANSPORTATION', value: 'TRANSPORTATION' },
                { label: 'HOUSING', value: 'HOUSING' },
                { label: 'INSURANCE', value: 'INSURANCE' },
                { label: 'ENTERTAINMENT', value: 'ENTERTAINMENT' },
                { label: 'GIFTS', value: 'GIFTS' },
                { label: 'OTHERS', value: 'OTHERS' },
                { label: 'DEBTS', value: 'DEBTS' },
                { label: 'EDUCATION', value: 'EDUCATION' },
                { label: 'PERSONAL CARE', value: 'PERSONAL CARE' },
                { label: 'ONLINE SERVICES', value: 'ONLINE SERVICES' },
                { label: 'CLOTHING', value: 'CLOTHING' },
                { label: 'HEALTH AND WELLNESS', value: 'HEALTH AND WELLNESS' },
              ]}
              minAmount={filterMinAmount}
              setMinAmount={setFilterMinAmount}
              maxAmount={filterMaxAmount}
              setMaxAmount={setFilterMaxAmount}
              startDate={filterStartDate}
              setStartDate={setFilterStartDate}
              endDate={filterEndDate}
              setEndDate={setFilterEndDate}
              filterClick={handleFilter}
              filterButtonText="Apply Filter"
            />}
            count={count}
            onEditClick={handleEdit}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            emptyMessage = "No data available"
            selected={selected}
            onSelectAllClick={handleSelectAllClick}
            onSelectClick={handleClick}
            onBatchDelete={() => setOpen(true)}
            isSelected={isSelected}
          />
          <ConfirmationModal 
            open={open} 
            handleClose={handleCancelDelete} 
            handleConfirm={handleBatchDelete} 
          />
        </div>
      </div>
    </div>
  );
};

export default Expense;
