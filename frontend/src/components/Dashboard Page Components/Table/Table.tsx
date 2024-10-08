/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useThemeBackground } from '../../../context/BackgroundContext';

interface Data {
  id: number;
  [key: string]: string | number;
}

interface Column {
  id: string;
  label: string;
  numeric: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: Data[];
  count: number;
  text?: any;
  filterData?: any;
  page: number;
  rowsPerPage: number;
  emptyMessage?: string;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: (row: any) => void;
  selected: number[];
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectClick: (event: React.MouseEvent<unknown>, id: number) => void;
  onBatchDelete: () => void;
  isSelected: (id: number) => boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data = [],
  count,
  text,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  filterData,
  emptyMessage,
  selected,
  onSelectAllClick,
  onSelectClick,
  onBatchDelete,
  isSelected
}) => {
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columns[0].id);

  // console.log("columns", columns[0].label)

  const { isDarkMode } = useThemeBackground();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: '100%' }} className="full-table">
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          
        }}
      >
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            backgroundColor: isDarkMode ? '#1f1f1f' : '',
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%', color: isDarkMode ? '#ff4d4d' : '#000'}}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              component="div"
            >
              {text}
            </Typography>
          )}
          {selected.length > 0 ? (
              <Button 
                  startIcon={<DeleteIcon />} 
                  onClick={onBatchDelete}
                  sx={{ color: isDarkMode ? '#ff4d4d' : '#f44336' }} 
                  color='error' 
                  variant='outlined'>Delete
              </Button>
             
          ) : (
            <>{filterData}</>
          )}
        </Toolbar>
        {data.length > 0 ? (
          <>
            <TableContainer>
              <Table
                sx={{
                  minWidth: 750,
                  backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
                }}
                aria-labelledby="tableTitle"
              >
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="default"
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        checked={data.length > 0 && selected.length === data.length}
                        onChange={onSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all items',
                        }}
                        sx={{
                              color: isDarkMode ? '#bbb' : '#555' 
                            }}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.numeric ? 'right' : 'left'}
                        padding="normal"
                        sortDirection={orderBy === column.id ? order : false}
                        sx={{
                          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                          
                          color: column.label === 'Id' ? (isDarkMode ? '#ccc' : '#000') : (isDarkMode ? '#ccc' : '#000'),
                        }}
                      >
                        
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, column.id)}
                        >
                          {column.label}
                          {orderBy === column.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{
                                                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                                                    color: isDarkMode ? '#ccc' : '#000'
                                                  }}
                    >Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => {
                    const isItemSelected = isSelected(row.id as number);
                    const labelId = `data-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => onSelectClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="default"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                            sx={{ color: isDarkMode ? '#bbb' : '#555' }}
                          />
                        </TableCell>
                        {columns.map((column) => (
                          <TableCell
                            align={column.numeric ? 'right' : 'left'}
                            key={column.id}
                            sx={{
                              color: isDarkMode ? '#ccc' : '#000',
                            }}
                          >
                            {row[column.id]}
                          </TableCell>
                        ))}
                        <TableCell align="center">
                          <Button 
                              endIcon={<EditIcon />}
                              color='primary'
                              variant='outlined'
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditClick(row);
                              }}
                          >Edit</Button>
                          {/* <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditClick(row);
                            }}
                          >
                            <EditIcon />
                          </IconButton> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {count - data.length > 0 && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={columns.length + 2} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
              sx={{
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#000',
              }}
            />
          </>
        ) : (
          <Typography
            sx={{ 
              textAlign: 'center', 
              color: 'error.main', 
              fontSize: '1.5rem', 
              backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
              }}
            className='text'
          >
            {emptyMessage}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DataTable;
