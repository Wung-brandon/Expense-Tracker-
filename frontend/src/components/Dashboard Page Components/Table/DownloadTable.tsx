import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField, MenuItem, Divider, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import {toast} from "react-toastify"

interface ExpenseRow {
  category: string;
  amount: string;
  description: string;
  date: string;
}

interface CustomizedTablesProps {
  columns: string[];
  rows: ExpenseRow[];
  onDateChange: (newDate: Dayjs) => void;
  message: string; // Message to display when data is unavailable for the selected month/year
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4a148c",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const exportOptions = ['PDF', 'CSV', 'Excel'];

const CustomizedTables: React.FC<CustomizedTablesProps> = ({ columns, rows, onDateChange, message }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedExportOption, setSelectedExportOption] = useState<string>('PDF');
  const [filteredRows, setFilteredRows] = useState<ExpenseRow[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = rows.filter(row => dayjs(row.date).isSame(selectedDate, 'month'));
      setFilteredRows(filtered);
    }
  }, [selectedDate, rows]);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      onDateChange(newDate);
    }
  };

  const handleExportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedExportOption(event.target.value);
  };

  const handleDownload = () => {
    if (filteredRows.length === 0) {
      alert(message); // Show message when no data is available for the selected month/year
      toast.warning("No data available")
      return;
    }

    switch (selectedExportOption) {
      case 'CSV':
        exportCSV();
        break;
      case 'PDF':
        exportPDF();
        break;
      case 'Excel':
        exportExcel();
        break;
      default:
        console.error('Invalid export option');
    }
  };

  const exportCSV = () => {
    const csvData = filteredRows.map(row => `${row.category},${row.amount},${row.description},${row.date}`).join('\n');
    const blob = new Blob([`Category,Amount,Description,Date\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'expenses.csv');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Category', 'Amount', 'Description', 'Date']],
      body: filteredRows.map(row => [row.category, row.amount, row.description || 'No description', row.date]),
    });
    doc.save('expenses.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'expenses.xlsx');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }} className='chart-container'>
        <TextField
          select
          label="Download as"
          value={selectedExportOption}
          onChange={handleExportChange}
          sx={{ width: 120 }}
        >
          {exportOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          <Divider orientation="horizontal" variant="middle" sx={{ margin: '10px 0', backgroundColor: '#000' }} />
        </TextField>

        <DatePicker
          views={['year', 'month']}
          sx={{marginLeft: '10px'}}
          label="Pick Month & Year"
          minDate={dayjs().subtract(10, 'year')}
          maxDate={dayjs()}
          value={selectedDate}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
            },
          }}
        />

        <Button
          variant="contained"
          className='ps-1'
          style={{backgroundColor: '#4a148c', color: 'white', marginLeft: '15px', marginBottom: '5px', marginTop: "2px" }}
          onClick={handleDownload}
        >
          Download
          
        </Button>
      </div>

      {filteredRows.length === 0 ? (
        <Typography variant="body1" color="error" className='text-center h2'>
          {message}
        </Typography>
      ) : (
        <TableContainer component={Paper} className='chart-container'>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell key={index}>{column}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{row.category}</StyledTableCell>
                  <StyledTableCell>{row.amount}</StyledTableCell>
                  <StyledTableCell>{row.description || 'No description'}</StyledTableCell>
                  <StyledTableCell>{row.date}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CustomizedTables;
