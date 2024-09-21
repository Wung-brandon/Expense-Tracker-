/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { AttachMoney } from '@mui/icons-material';
import PieChart from '../../components/Dashboard Page Components/Chart/Chart';
import useAxios from '../../utils/useAxios';
import TotalCard from '../../components/Dashboard Page Components/Widgets/Widgets.components';
import KeepMountedModal from '../../components/Dashboard Page Components/Modal/Modal.component';
import './income.css';
import { toast } from 'react-toastify';
import DataTable from '../../components/Dashboard Page Components/Table/Table';
import ConfirmationModal from '../../components/Dashboard Page Components/Modal/confirmModal';
import SearchBar from '../../components/Dashboard Page Components/Search/SearchBar';
import FilterBar from '../../components/Dashboard Page Components/Filter/FillterBar';
import ButtonComponent from '../../components/Dashboard Page Components/Button/Button.component';
import { Typography } from '@mui/material';

interface Data {
  id: number;
  source: string;
  description: string;
  amount: number;
  date: string;
}

const Income: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [source, setSource] = useState<string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [incomeData, setIncomeData] = useState<Data[]>([]);
  const [originalIncomeData, setOriginalIncomeData] = useState<Data[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<Data | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const [open, setOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterMinAmount, setFilterMinAmount] = useState<number | ''>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  
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
      const response = await axiosInstance.get(`/track/income/?page=${page + 1}&size=${rowsPerPage}`);
      const responseData = response.data;
      setIncomeData(responseData.results);
      setOriginalIncomeData(responseData.results)
      setCount(responseData.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // console.log("income data", incomeData);
  const handleIncomeSubmit = async (formData: { [key: string]: any }) => {
    // setIsLoading(false); // Start the loading spinner
    // console.log('handleIncomeSubmit: Setting isLoading to true', isLoading);

    try {
      // Ensure amount is a number and positive
      if (typeof formData.amount === 'string') {
        formData.amount = parseFloat(formData.amount);
        if (formData.amount < 0) {
          toast.warning("Income cannot be negative");
          return; // Stop if invalid
        }
      }

      // Format date
      if (formData.date) {
        formData.date = new Date(formData.date).toISOString().split('T')[0];
      }

      // Determine if we're in edit mode or add mode
      if (editMode) {
        console.log("formData updated", formData);
        // Update income logic
        await axiosInstance.put(`/track/income/${editData?.id}/`, formData);
        
        await fetchAllData();
        toast.success("Income updated successfully");
      } else {
        // Add new income logic
        await axiosInstance.post('/track/income/', formData);
        await fetchAllData();
        toast.success("Income added successfully");
      }

      // Refresh data or other post-submit actions
    } catch (error:any) {
      toast.error(`Error processing income: ${error.response?.data?.message || error.message}`);
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
    setSource('');
    setEditMode(false); // Switch back to add mode
    setEditData(null); // Clear edit data
  };
  
    

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get('/userstats/monthly-summary/')
        .then((response) => {
          const responseData = response.data.monthly_summary;
          // console.log("monthly-data",responseData);
          const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in 'YYYY-MM' format
  
          // Find the summary for the current month
          const currentMonthSummary = responseData.find((item: any) => item.month === currentMonth);
  
          if (currentMonthSummary) {
            // Set total income for the current month
            setTotal(currentMonthSummary.income);
  
            // Extract income sources and amounts
            const sources = currentMonthSummary.income_sources.map((source: any) => source.source);
            const amounts = currentMonthSummary.income_sources.map((source: any) => source.total_amount);
  
            // Set data for chart or display
            setLabels(sources);
            setData(amounts);
          } else {
            // If no data for the current month, set income and chart to empty states
            setTotal(0); // Set total income to 0
            setLabels([]); // Clear chart labels
            setData([]); // Clear chart data
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
  

  const incomeFields = [
    {
      label: 'Source',
      type: 'select',
      name: 'source',
      value: source,
      onChange: (e: React.ChangeEvent<{ value: unknown }>) => setSource(e.target.value as string),
      required: true,
      options: [
        { label: 'SALARY', value: 'SALARY' },
        { label: 'BUSINESS', value: 'BUSINESS' },
        { label: 'SIDE HUSTLE', value: 'SIDE HUSTLE' },
        { label: 'INVESTMENTS', value: 'INVESTMENTS' },
        { label: 'INHERITANCE', value: 'INHERITANCE' },
        { label: 'GIFTS', value: 'GIFTS' },
        { label: 'OTHERS', value: 'OTHERS' },
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
    { id: 'source', label: 'Source', numeric: false },
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
      const newSelected = incomeData.map((item) => item.id as number);
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
      await Promise.all(selected.map((id) => axiosInstance.delete(`/track/income/${id}/`)));
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
    const filtered = originalIncomeData.filter(item =>
      item.source.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.amount.toString().includes(searchText) ||
      item.date.includes(searchText)
    );
    setIncomeData(filtered);
    setSearchText("")
  }

  const handleFilter = async () => {
    const params: Record<string, any> = {};
  
    // Add your filters (source, amount, dates)
    if (filterSource && filterSource !== 'ALL') params.source = filterSource;
    if (filterMinAmount !== '') params['amount__gt'] = filterMinAmount;
    if (filterMaxAmount !== '') params['amount__lt'] = filterMaxAmount;
    if (filterStartDate) params['date__gte'] = filterStartDate.toISOString().split('T')[0];
    if (filterEndDate) params['date__lte'] = filterEndDate.toISOString().split('T')[0];
  
    // Set pagination params
    params.page = 1;
    params.size = 10;  // Adjust according to your pagination setup
  
    try {
      const response = await axiosInstance.get('/track/income/', { params });
      const paginatedData = response.data.results || response.data;
      
      console.log("data" ,paginatedData)
  
      // Log the paginated data to inspect it
      console.log("Paginated Data: ", JSON.stringify(paginatedData, null, 2));
  
      if (Array.isArray(paginatedData)) {
        setOriginalIncomeData(paginatedData)
        setIncomeData(paginatedData);

      } else {
        console.error('Received data is not an array');
      }
  
      // Clear the filters after applying
      setSource("")
      setFilterMinAmount("");
      setFilterMaxAmount("");
      setFilterStartDate(null);
      setFilterEndDate(null);
    } catch (error) {
      console.error('Error fetching filtered income:', error);
    }
    
  };

  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="income" style={{ margin: '7rem' }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-4">
        <h2 className="text-center mb-3 mb-sm-0">Income Summary</h2>
        <ButtonComponent text='Add Income' onClick={handleAddIncomeClick}/>
        <KeepMountedModal 
          title={editMode ? "Edit Income" : "Add Income"} 
          buttonText={editMode ? "Update Income" : "Add Income"}
          fields={incomeFields}
          onSubmit={handleIncomeSubmit}
          open={modalOpen}
          onClose={closeModal}
          isEditMode={editMode}
          initialData={editData}
          
        />
      </div>

      <div className="row shadow" style={{borderRadius:"1.5rem"}}>
        <div className="col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
            <TotalCard 
                title={`Total Income For ${currentMonth}`} 
                total={`$${total}`} 
                icon={AttachMoney} 
                backgroundColor="#E8F5E9"
                hoverBackgroundColor="#4CAF50"  
                iconColor="#2E7D32"
                hoverIconColor="#FFFFFF"
                width={{xs:"50%", sm: "70%"}}
            />
          </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          {total === 0 ? <Typography  
                              color='error' 
                              sx={{fontSize:"1.5rem", textAlign:"center", marginTop:"7rem"}}
                          >No Income Source</Typography> : 
            <PieChart data={data} labels={labels} title={`Income Distribution By Source In ${currentMonth}`} />
          } 
        </div>
      </div>
      <div className="d-flex flex-column mt-5">

        <DataTable 
            columns={columns} 
            data={incomeData}
            page={page}
            text={<SearchBar 
                      placeholder='Search by Source, Description, Date and Amount'
                      value={searchText}
                      onChange={(e:any) => setSearchText(e.target.value)}
                      onClick={handleSearch}
                  />}
            filterData={<FilterBar
              selectLabel="Source"
              selectValue={filterSource}
              setSelectValue={setFilterSource}
              selectOptions={[
                { label: "ALL", value: "ALL" },
                { label: "SALARY", value: "SALARY" },
                { label: "BUSINESS", value: "BUSINESS" },
                { label: "SIDE HUSTLE", value: "SIDE HUSTLE" },
                { label: "INVESTMENTS", value: "INVESTMENTS" },
                { label: "INHERITANCE", value: "INHERITANCE" },
                { label: "GIFTS", value: "GIFTS" },
                { label: "OTHERS", value: "OTHERS" }
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
