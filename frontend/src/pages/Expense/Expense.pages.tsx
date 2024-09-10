
import React, { useState, useEffect } from 'react';
import { AttachMoney } from '@mui/icons-material';
import PieChart from '../../components/Dashboard Page Components/Chart/Chart';
import useAxios from '../../utils/useAxios';
import TotalCard from '../../components/Dashboard Page Components/Widgets/Widgets.components';
import KeepMountedModal from '../../components/Dashboard Page Components/Modal/Modal.component';
import { toast } from 'react-toastify';
import DataTable from '../../components/Dashboard Page Components/Table/Table';
import ConfirmationModal from '../../components/Dashboard Page Components/Modal/confirmModal';
import { MoneyOff } from '@mui/icons-material';
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

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Data | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [totalIncome, setTotalIncome] = useState<number>(0);

  // const {isDarkMode, toggleTheme} = useThemeBackground()

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
            console.log("total income", currentMonthSummary.income)
            // Extract income sources and amounts
            const categories = currentMonthSummary.expense_categories.map((category: any) => category.category);
            const amounts = currentMonthSummary.expense_categories.map((category: any) => category.total_amount);

            // Set data for chart or display
            setLabels(categories);
            setData(amounts);
          } else {
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


  const handleExpenseSubmit = (formData: { [key: string]: any }) => {
    if (typeof formData.amount === 'string') {
      formData.amount = parseFloat(formData.amount);
      if (formData.amount > totalIncome){
        // console.log("expenses cannot exceed total income")
        toast.warning("Expenses cannot exceed total income")
      }
    }

    if (formData.date) {
      formData.date = new Date(formData.date).toISOString().split('T')[0];
    }

    const request = editMode
      ? axiosInstance.put(`/track/expense/${editData?.id}/`, formData)
      : axiosInstance.post('/track/expense/', formData);

    request
      .then(response => {
        toast.success(editMode ? 'Expense updated successfully.' : 'Expense added successfully.');
        setAmount('');
        setDescription('');
        setDate('');
        setCategory('');
        setEditMode(false);
        setEditData(null);
        fetchAllData(); // Refresh data after add/update
      })
      .catch(error => {
        toast.error(`Error ${editMode ? 'updating' : 'adding'} Expense: ${error.response?.data?.message || error.message}`);
      });
  };

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

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        const response = await axiosInstance.delete(`track/expense/${selectedId}/`);
        if (response.status === 204) {
          toast.success('Successfully deleted');
          setExpenseData((prevData) => prevData.filter((item) => item.id !== selectedId));
        } else {
          toast.error('Error deleting');
        }
      } catch (error: unknown) {
        toast.error('Error deleting');
      } finally {
        setOpen(false);
        setSelectedId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpen(false);
    setSelectedId(null);
  };


  const closeModal = () => {
    setEditMode(false);
    setEditData(null);
    setModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString("default", {month: "long"})

  return (
    <div className="income" style={{margin: "7rem"}}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-4">
        <h2 className="text-center mb-3 mb-sm-0">Expense Summary</h2>
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
          {total === 0 ? <h2 className='text-center mt-5'>No Expense Category</h2> : 
            <PieChart data={data} labels={labels} title={`Expense Category For ${currentMonth}`} />
          } 
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <DataTable 
            columns={columns} 
            data={expenseData}
            page={page}
            text="Expense Data"
            count={count}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEdit}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <ConfirmationModal 
            open={open} 
            handleClose={handleCancelDelete} 
            handleConfirm={handleConfirmDelete} 
          />
        </div>
      </div>
    </div>
  );
};

export default Expense;
