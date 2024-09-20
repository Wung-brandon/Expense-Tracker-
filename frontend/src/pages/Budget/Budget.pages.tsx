/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { AttachMoney } from '@mui/icons-material';
import useAxios from '../../utils/useAxios';
import TotalCard from '../../components/Dashboard Page Components/Widgets/Widgets.components';
import KeepMountedModal from '../../components/Dashboard Page Components/Modal/Modal.component';
import { toast } from 'react-toastify';
import DataTable from '../../components/Dashboard Page Components/Table/Table';
import ConfirmationModal from '../../components/Dashboard Page Components/Modal/confirmModal';
import SearchBar from '../../components/Dashboard Page Components/Search/SearchBar';
import FilterBar from '../../components/Dashboard Page Components/Filter/FillterBar';
import ButtonComponent from '../../components/Dashboard Page Components/Button/Button.component';
import { Typography } from '@mui/material';
import LineAreaChart from '../../components/Dashboard Page Components/Chart/LineareaChart';

interface Data {
  id: number;
  description: string;
  amount: number;
  month: string;
}

interface MonthlyDataTrend {
  month: string;
  budget: number;
  balance: number
  expenseBalance: number
}

const Income: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [budgetData, setBudgetData] = useState<Data[]>([]);
  const [originalBudgetData, setOriginalBudgetData] = useState<Data[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<Data | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const [open, setOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [filterAll, setFilterAll] = useState<string>('');
  const [filterMinAmount, setFilterMinAmount] = useState<number | ''>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [monthlyData, setMonthlyData] = useState<MonthlyDataTrend[]>([]);
  
  // const [isLoading, setIsLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const [selected, setSelected] = useState<number[]>([]);

  const axiosInstance = useAxios();
  useEffect(() => {
    fetchAllData();
  }, []);
  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/track/budget/?page=${page + 1}&size=${rowsPerPage}`);
      const responseData = response.data;
      console.log("original data: ", responseData)
      setBudgetData(responseData.results);
      setOriginalBudgetData(responseData.results)
      setCount(responseData.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // console.log("original data: ", originalBudgetData)

  // console.log("income data", incomeData);
  const handleBudgetSubmit = async (formData: { [key: string]: any }) => {
    // setIsLoading(false); // Start the loading spinner
    // console.log('handleIncomeSubmit: Setting isLoading to true', isLoading);

    try {
      // Ensure amount is a number and positive
      if (typeof formData.amount === 'string') {
        formData.amount = parseFloat(formData.amount);
        if (formData.amount < 0) {
          toast.warning("Budget cannot be negative");
          return; // Stop if invalid
        }
        else if (formData.amount > totalIncome || formData.amount + total > totalIncome){
          toast.warning("Budget cannot exceed Total Income")
        }
      }

      // Format date
      if (formData.date) {
        formData.date = new Date(formData.date).toISOString().split('T')[0];
      }

      // Determine if we're in edit mode or add mode
      if (editMode) {
        // Update income logic
        await axiosInstance.put(`/track/budget/${editData?.id}/`, formData);
        await fetchAllData();
        toast.success("Budget updated successfully");
      } else {
        // Add new income logic
        await axiosInstance.post('/track/budget/', formData);
        await fetchAllData();
        toast.success("Budget added successfully");
      }

      // Refresh data or other post-submit actions
    } catch (error) {
      // toast.error(`Error processing income: ${error.response?.data?.message || error.message}`);
      console.log(error);
    } finally {
      // setIsLoading(false); // Stop the loading spinner
      setModalOpen(false); // Close the modal
      // console.log('handleIncomeSubmit: Setting isLoading to false', isLoading);
    }
  };

  
  // Function to reset the form fields
  const resetForm = () => {
    setAmount('');
    setDescription('');
    setDate('');
    setEditMode(false); // Switch back to add mode
    setEditData(null); // Clear edit data
  };
  
    

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get('/userstats/monthly-summary/')
        .then((response) => {
          const responseData = response.data.monthly_summary;
          const data = responseData.map((monthData: any) => ({
            month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(monthData.month)),
            expenses: monthData.expenses,
            income: monthData.income,
            budget: monthData.budget,
            balance: monthData.balance,
            // expenseBalance: monthData.budget - monthData.expenses
          }));
          
          setMonthlyData(data);
          // console.log("monthly-data",responseData);
          const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in 'YYYY-MM' format
  
          // Find the summary for the current month
          const currentMonthSummary = responseData.find((item: any) => item.month === currentMonth);
  
          if (currentMonthSummary) {
            // Set total income for the current month
            setTotal(currentMonthSummary.budget);
            setTotalIncome(currentMonthSummary.income);
            setTotalExpense(currentMonthSummary.expenses);
            // console.log("total expense",currentMonthSummary.expenses)
            
          } else {
            // If no data for the current month, set income and chart to empty states
            setTotal(0); // Set total income to 0
            console.log('No data available for the current month.');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
  
    // Fetch data every second
    const intervalId = setInterval(fetchData, 1000); // 1000ms = 1 second
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array so this runs once when the component mounts
  

  const budgetFields = [
    {
      label: 'Amount',
      type: 'number',
      name: 'amount',
      value: amount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value),
      required: true,
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
      label: 'Date',
      type: 'date',
      name: 'date',
      value: date,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value),
      required: true,
    },
  ];

  const columns = [
    { id: 'id', label: 'Id', numeric: true },
    { id: 'amount', label: 'Amount', numeric: true },
    { id: 'date', label: 'Date', numeric: false },
    { id: 'description', label: 'Description', numeric: false },
  ];

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    fetchAllData();
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchAllData();
  };

  const handleEdit = (row: Data) => {
  setEditMode(true); // Set to edit mode
  setEditData(row); // Prefill data with selected row
  setModalOpen(true); // Open modal
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = budgetData.map((item) => item.id as number);
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
    setConfirmLoading(true);
    try {
      await Promise.all(selected.map((id) => axiosInstance.delete(`/track/budget/${id}/`)));
      toast.success('Successfully deleted');
      setOpen(false)
      setSelected([]);
      fetchAllData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
    }
    finally{
      setConfirmLoading(false)
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

  const handleAddIncomeClick = () => {
    resetForm(); // Clear fields before opening
    setEditMode(false); // Set to add mode
    setModalOpen(true); // Open modal
  };

  if (loading) return <div>Loading...</div>;

  function handleSearch(){
    const filtered = originalBudgetData.filter(item =>
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.amount.toString().includes(searchText) ||
      item.month.includes(searchText)
    );
    // console.log("search filtered", filtered);
    setBudgetData(filtered);
    setSearchText("")
  }

  const handleFilter = async () => {
    const params: Record<string, any> = {};
  
    // Add your filters (source, amount, dates)
    if (filterAll && filterAll !== 'ALL') params.all = filterAll;
    if (filterMinAmount !== '') params['amount__gt'] = filterMinAmount;
    if (filterMaxAmount !== '') params['amount__lt'] = filterMaxAmount;
    if (filterStartDate) params['date__gte'] = filterStartDate.toISOString().split('T')[0];
    if (filterEndDate) params['date__lte'] = filterEndDate.toISOString().split('T')[0];
  
    // Set pagination params
    params.page = 1;
    params.size = 10;  // Adjust according to your pagination setup
  
    try {
      const response = await axiosInstance.get('/track/budget/', { params });
      const paginatedData = response.data.results || response.data;
      
      // console.log("data" ,paginatedData)
  
      // Log the paginated data to inspect it
      console.log("Paginated Data: ", JSON.stringify(paginatedData, null, 2));
  
      if (Array.isArray(paginatedData)) {
        setOriginalBudgetData(paginatedData)
        setBudgetData(paginatedData);

      } else {
        console.error('Received data is not an array');
      }
  
      setFilterMinAmount("");
      setFilterMaxAmount("");
      setFilterStartDate(null);
      setFilterEndDate(null);
    } catch (error) {
      console.error('Error fetching filtered income:', error);
    }
    
  };

  

  const monthBudgetData = monthlyData.map((item) => item.budget)
  // console.log("monthlybudgetData: ", monthBudgetData)
  const monthlyLabels = monthlyData.map((item) => item.month);
  const monthlyBalanceBudget = total - totalExpense

  console.log("monthlyBalanceBudget: ", monthlyBalanceBudget)

  // console.log("expense budget balance: ", monthlyBalanceBudget);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="income" style={{ margin: '7rem' }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-4">
        <h2 className="text-center mb-3 mb-sm-0">Budget Summary</h2>
        <ButtonComponent text='Add Budget' onClick={handleAddIncomeClick}/>
        <KeepMountedModal 
          title={editMode ? "Edit Budget" : `Set Budget For ${currentMonth}`} 
          buttonText={editMode ? "Update Budget" : "Add Budget"}
          fields={budgetFields}
          onSubmit={handleBudgetSubmit}
          open={modalOpen}
          onClose={closeModal}
          isEditMode={editMode}
          initialData={editData}
          
        />
      </div>

      <div className="row shadow" style={{borderRadius:"1.5rem"}}>
        <div className="col-lg-6 col-md-12 col-sm-12 mb-md-0 d-flex justify-content-lg-start justify-content-md-center align-items-center flex-column">
          <TotalCard 
              title={`Total Budget For ${currentMonth}`} 
              total={`$${total}`} 
              icon={AttachMoney} 
              backgroundColor="#E3F2FD"
              hoverBackgroundColor="#2196F3"  
              iconColor="#1565C0"
              hoverIconColor="#FFFFFF"
              width={{xs:"50%", sm: "70%"}}
          />
          <TotalCard 
              title={`Total Balance Between Budget and Expenses In ${currentMonth}`} 
              total={`$${monthlyBalanceBudget}`} 
              icon={AttachMoney} 
              backgroundColor="#F3E5F5"
              hoverBackgroundColor="#9C27B0"  
              iconColor="#6A1B9A"
              hoverIconColor="#FFFFFF"
              width={{xs:"50%", sm: "70%"}}
          />
      </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          {total === 0 ? <Typography  
                              color='error' 
                              sx={{fontSize:"1.5rem", textAlign:"center", marginTop:"7rem"}}
                          >No Budget Source</Typography> : 
            <LineAreaChart
            chartTitle="Monthly Budget Trend"
            name="Budget"
            labels={monthlyLabels}
            data={monthBudgetData}
            color="#ffc107"
          />
          } 
        </div>
      </div>
      <div className="d-flex flex-column mt-5">

        <DataTable 
            columns={columns} 
            data={budgetData}
            page={page}
            text={<SearchBar 
                      placeholder='Search by Description, Date and Amount'
                      value={searchText}
                      onChange={(e:any) => setSearchText(e.target.value)}
                      onClick={handleSearch}
                  />}
            filterData={<FilterBar
              selectLabel="Budget"
              selectValue={filterAll}
              setSelectValue={setFilterAll}
              selectOptions={[
                { label: "ALL", value: "ALL" }
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
          handleConfirm={handleBatchDelete}
          handleClose={handleCancelDelete}
          loading={confirmLoading}
        />
      </div>
    </div>
  );
};

export default Income;
