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
// import SearchBar from '../../components/Dashboard Page Components/Search/SearchBar';
// import FilterBar from '../../components/Dashboard Page Components/Filter/FilterBar';
import SearchBar from '../../components/Dashboard Page Components/Search/SearchBar';
import FilterBar from '../../components/Dashboard Page Components/Filter/FillterBar';


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
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Data | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterMinAmount, setFilterMinAmount] = useState<number | ''>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

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
      setCount(responseData.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleIncomeSubmit = (formData: { [key: string]: any }) => {
    if (typeof formData.amount === 'string') {
      formData.amount = parseFloat(formData.amount);
      if (formData.amount < 0){
        toast.warning("Income cannot be negative")
      }
    }

    if (formData.date) {
      formData.date = new Date(formData.date).toISOString().split('T')[0];
    }

    const request = editMode
      ? axiosInstance.put(`/track/income/${editData?.id}/`, formData)
      : axiosInstance.post('/track/income/', formData);

    request
      .then(response => {
        toast.success(editMode ? 'Income updated successfully.' : 'Income added successfully.');
        setAmount('');
        setDescription('');
        setDate('');
        setSource('');
        setEditMode(false);
        setEditData(null);
        fetchAllData(); // Refresh data after add/update
      })
      .catch(error => {
        // toast.error(`Error ${editMode ? 'updating' : 'adding'} income: ${error.response?.data?.message || error.message}`);
        console.error(error)
      });
  };

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
            setTotal(currentMonthSummary.income);

            // Extract income sources and amounts
            const sources = currentMonthSummary.income_sources.map((source: any) => source.source);
            const amounts = currentMonthSummary.income_sources.map((source: any) => source.total_amount);

            // Set data for chart or display
            setLabels(sources);
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
    setEditMode(true);
    setEditData(row);
    setSource(row.source);
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
        const response = await axiosInstance.delete(`track/income/${selectedId}/`);
        if (response.status === 204) {
          toast.success('Successfully deleted');
          setIncomeData((prevData) => prevData.filter((item) => item.id !== selectedId));
        } else {
          toast.error('Error deleting');
        }
      } catch (error: unknown) {
        console.log(error);
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

  function handleSearch(){
    const filtered = incomeData.filter(item =>
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
    if (filterSource) params.source = filterSource;
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
        <div className="col-12 col-md-6 mb-4 mb-md-0 mt-5 mb-3">
            <TotalCard 
                title={`Total Income For ${currentMonth}`} 
                total={`$${total}`} 
                icon={AttachMoney} 
                backgroundColor="#E8F5E9"
                hoverBackgroundColor="#4CAF50"  
                iconColor="#2E7D32"
                hoverIconColor="#FFFFFF"
            />
          </div>

        <div className="col-12 col-md-6">
          {total === 0 ? <h2 className='text-center mt-5'>No Income Source</h2> : 
            <PieChart data={data} labels={labels} title={`Income Sources For ${currentMonth}`} />
          } 
        </div>
      </div>
      <div className="d-flex flex-column">

        <DataTable 
            columns={columns} 
            data={incomeData}
            page={page}
            text={<SearchBar 
                      placeholder='Search by Source, Description'
                      value={searchText}
                      onChange={(e:any) => setSearchText(e.target.value)}
                      onClick={handleSearch}
                  />}
            filterData={<FilterBar
              selectLabel="Source"
              selectValue={filterSource}
              setSelectValue={setFilterSource}
              selectOptions={[
                { label: "All", value: "" },
                { label: "Salary", value: "SALARY" },
                { label: "Business", value: "BUSINESS" },
                { label: "Side Hustle", value: "SIDE HUSTLE" },
                { label: "Investments", value: "INVESTMENTS" },
                { label: "Inheritance", value: "INHERITANCE" },
                { label: "Gifts", value: "GIFTS" },
                { label: "Others", value: "OTHERS" }
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
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEdit}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            emptyMessage = "No data available"
          />
  
        <ConfirmationModal
          open={open}
          handleConfirm={handleConfirmDelete}
          handleClose={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default Income;
