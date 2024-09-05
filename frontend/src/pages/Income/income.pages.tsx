
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
// import { useThemeBackground } from '../../context/BackgroundContext';

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

  // const {isDarkMode, toggleTheme} = useThemeBackground()

  const axiosInstance = useAxios();

  useEffect(() => {
    axiosInstance.get('/userstats/income-summary/')
      .then(response => {
        const responseData = response.data.income_source_data;
        const totalAmount = response.data.total_income;
        setTotal(totalAmount);
        const labels = responseData.map((item: any) => item.source);
        const data = responseData.map((item: any) => item.total_amount);
        setData(data);
        setLabels(labels);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [axiosInstance]);

  const handleIncomeSubmit = (formData: { [key: string]: any }) => {
    if (typeof formData.amount === 'string') {
      formData.amount = parseFloat(formData.amount);
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
        toast.error(`Error ${editMode ? 'updating' : 'adding'} income: ${error.response?.data?.message || error.message}`);
      });
  };

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

  useEffect(() => {
    fetchAllData();
  }, [page, rowsPerPage]);

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

  return (
    <div className="income mt-4">
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
      <div className="row shadow">
        <div className="col-12 col-md-6 mb-4 mb-md-0 mt-5 mb-3">
          <TotalCard title="Total Income" total={total} icon={AttachMoney} />
        </div>
        <div className="col-12 col-md-6">
          {total === 0 ? <h2 className='text-center mt-5'>No Income Source</h2> : 
            <PieChart data={data} labels={labels} title="Income sources" />
          } 
        </div>
      </div>
      <div className="row shadow mt-5">
        <div className="col-12">
          <DataTable 
            columns={columns} 
            data={incomeData}
            page={page}
            text="Income Data"
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

export default Income;
