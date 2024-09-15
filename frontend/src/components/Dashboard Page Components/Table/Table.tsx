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
// import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: '100%' }} className="shadow">
      <Paper sx={{ width: '100%', mb: 2 }} className='bag'>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
          className='tablecell'
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
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
            <Tooltip title="Delete">
              <IconButton
              className='tablecell'
                onClick={onBatchDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
          
            <>
              {filterData}
            </>
            
          )}
        </Toolbar>
        {data.length > 0 ? (
          <>
        <TableContainer className='bag'>
          
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" className='tablecell'>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < data.length}
                                    checked={data.length > 0 && selected.length === data.length}
                                    onChange={onSelectAllClick}
                                    className='tablecell'
                                    inputProps={{
                                      'aria-label': 'select all items',
                                    }}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.numeric ? 'right' : 'left'}
                      padding="normal"
                      sortDirection={orderBy === column.id ? order : false}
                      className='tablecell'
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.id)}
                        className='tablecell'
                      >
                        {column.label}
                        {orderBy === column.id ? (
                          <Box component="span" sx={visuallyHidden} className='tablecell'>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell align="center" className='tablecell'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='tablecell'>
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
                      className='tablecell'
                    >
                      <TableCell padding="checkbox" className='tablecell'>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          className='tablecell'
                        />
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell
                          align={column.numeric ? 'right' : 'left'}
                          key={column.id}
                          sx={{ textDecoration: 'capitalize' }}
                          className='tablecell'
                        >
                          {row[column.id]}
                        </TableCell>
                      ))}
                      <TableCell align="center" className='tablecell'>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(row);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {count - data.length > 0 && (
                  <TableRow style={{ height: 53 }} className='tablecell'>
                    <TableCell colSpan={columns.length + 2} className='tablecell'/>
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
            className='bag'
            
          /> 
        </>
        ) : 
            <Typography 
                className='text-center' 
                color='error'
                sx={{fontSize:"1.5rem", marginTop:"3rem", marginBottom:"2rem"}}
            >{emptyMessage}</Typography>
        }
        
        
      </Paper>
    </Box>
  );
};

export default DataTable;
