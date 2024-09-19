/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import useAxios from '../../utils/useAxios';
import ReportApexBarChart from '../../components/Dashboard Page Components/Chart/ReportChart';
// import AreaChart from '../../components/Dashboard Page Components/Chart/AreaChart';
// import LineChart from '../../components/Dashboard Page Components/Chart/LineChart';
import StackBarChart from '../../components/Dashboard Page Components/Chart/StackBarChart';
// import { ProgressBar } from 'react-bootstrap';
import { CircularProgress, Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import CustomizedTables from '../../components/Dashboard Page Components/Table/DownloadTable';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import LineAreaChart from '../../components/Dashboard Page Components/Chart/LineareaChart';
interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  budget: number;
  // balance: number;
}

interface MonthlyExpenseSummaryTableData {
  id? : number;
  category : string;
  amount: number;
  description: string;
  date: string;
}

const Reports: React.FC = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const monthNumber = currentDate.getMonth() + 1
  // console.log(`month: ${monthNumber}`)
  // console.log("current year: " + currentYear)
  const currentMonth = currentDate.toLocaleString("default", {month: "long"})
  // console.log(`month name: ${currentMonth}`)

  const [year, setYear] = useState<number>(currentYear); // Set default to current year
  const [month, setMonth] = useState<number>(monthNumber);
  
  const [overallIncomeData, setOverallIncomeData] = useState<number[]>([]);
  const [overallIncomeLabels, setOverallIncomeLabels] = useState<string[]>([]);

  const [overallExpenseData, setOverallExpenseData] = useState<number[]>([]);
  const [overallExpenseLabels, setOverallExpenseLabels] = useState<string[]>([]);


  const [currentMonthIncomeData, setCurrentMonthIncomeData] = useState<number[]>([]);
  const [currentMonthIncomeLabels, setCurrentMonthIncomeLabels] = useState<string[]>([]);

  const [currentMonthExpenseData, setCurrentMonthExpenseData] = useState<number[]>([]);
  const [currentMonthExpenseLabels, setCurrentMonthExpenseLabels] = useState<string[]>([]);

  const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);

  const [monthlyExpenseTableData, setMonthlyExpenseTableData] = useState<MonthlyExpenseSummaryTableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentWeekExpenseData, setCurrentWeekExpenseData] = useState<number[]>([]);
  const [currentWeekExpenseLabels, setCurrentWeekExpenseLabels] = useState<string[]>([]);

  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchIncomeData = () => {
      axiosInstance.get('/userstats/income-summary/')
      .then((response) => {
        const responseData = response.data.income_source_data;
        const labels = responseData.map((item: any) => item.source);
        const data = responseData.map((item: any) => item.total_amount);
        setOverallIncomeData(data);
        setOverallIncomeLabels(labels);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
    const intervalId = setInterval(fetchIncomeData, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  
  useEffect(() => {
    const fetchExpenseData = () => {
      axiosInstance.get('/userstats/expense-summary/')
      .then((response) => {
        const responseData = response.data.category_data;
        const labels = responseData.map((item: any) => item.category);
        const data = responseData.map((item: any) => item.total_amount);
        setOverallExpenseData(data);
        setOverallExpenseLabels(labels);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
    const intervalId = setInterval(fetchExpenseData, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchCurrentMonthExpenseData = () => {
      axiosInstance.get('/userstats/monthly-summary/')
        .then(response => {
          const responseData = response.data.monthly_summary;
          // console.log("monthly summary", responseData);
          const currentMonth = new Date().toISOString().slice(0, 7); 
          // console.log("Current month: " + currentMonth)
          const currentMonthSummary = responseData.find((item: any) => item.month === currentMonth);

          if (currentMonthSummary) {    
            const categories = currentMonthSummary.expense_categories.map((category: any) => category.category);
            const amounts = currentMonthSummary.expense_categories.map((category: any) => category.total_amount);
            setCurrentMonthExpenseData(amounts);
            setCurrentMonthExpenseLabels(categories);
          } else {
            console.log('No data available for the current month.');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };
    const intervalId = setInterval(fetchCurrentMonthExpenseData, 1000); 

    return () => clearInterval(intervalId);
  }, []); 


  useEffect(() => {
    const fetchCurrentMonthIncomeData = () => {
      axiosInstance.get('/userstats/monthly-summary/')
        .then(response => {
          const responseData = response.data.monthly_summary;
          // console.log("monthly data",responseData);
          const currentMonth = new Date().toISOString().slice(0, 7); 

          const currentMonthSummary = responseData.find((item: any) => item.month === currentMonth);

          if (currentMonthSummary) {

            const sources = currentMonthSummary.income_sources.map((source: any) => source.source);
            const amounts = currentMonthSummary.income_sources.map((source: any) => source.total_amount);

           
            setCurrentMonthIncomeLabels(sources);
            setCurrentMonthIncomeData(amounts);
          } else {
            console.log('No data available for the current month.');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };

    
    const intervalId = setInterval(fetchCurrentMonthIncomeData, 1000); 

    return () => clearInterval(intervalId);
  }, []); 

  useEffect(() => {
    const fetchMonthlyData = () => {
      axiosInstance.get("/userstats/monthly-summary/")
      .then((response) => {
        const data = response.data.monthly_summary.map((monthData: any) => ({
          month: new Intl.DateTimeFormat("en-US", { month: "long" })
            .format(new Date(monthData.month)),
          income: monthData.income,
          expenses: monthData.expenses,
          budget: monthData.budget,
          // balance: monthData.income - monthData.expenses, 
        }));
        // console.log("monthData: " , data)
        
        setMonthlyData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
    const intervalId = setInterval(fetchMonthlyData, 1000); 

    return () => clearInterval(intervalId);
  }, []);
  

  const series = [
    {
      name: "Income",
      data: monthlyData.map((item) => item.income),
    },
    {
      name: "Expenses",
      data: monthlyData.map((item) => item.expenses),
    },
    {
      name: "Budget",
      data: monthlyData.map((item) => item.budget),
    },
    // {
    //   name: "Balance",
    //   data: monthlyData.map((item) => item.balance),
    // },
  ];

  // X-axis categories (months)
  const categories = monthlyData.map((item) => item.month);

  // const columns = [
  //   // { id: 'id', label: 'Id', numeric: true },
  //   { id: 'amount', label: 'Amount', numeric: true },
  //   { id: 'date', label: 'Date', numeric: false },
  //   { id: 'category', label: 'Category', numeric: false },
  //   { id: 'description', label: 'Description', numeric: false },
  // ];

  // useEffect(() => {
  //   const fetchMonthlyExpenseTableData = async () => {
  //     const response = await axiosInstance.get(`/userstats/expenses/${year}/${month}/`)
  //     const expenseData = response.data.expenses
  //     console.log("expenses data year and month", expenseData)
  //     setMonthlyExpenseTableData(expenseData)
  //   }

  //   const intervalId = setInterval(fetchMonthlyExpenseTableData, 1000); 

  //   return () => clearInterval(intervalId);
  // }, [])

  

  function getWeekNumber(date:any){
    const oneJan:any = new Date(currentDate.getFullYear(), 0, 1)
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getTimezoneOffset() / 1440 ) / 7)
  }
  
  const currentYearWeekNumber = getWeekNumber(currentDate)
  // const previousYearWeekNumber = currentYearWeekNumber - 1;
  // console.log("previous week number",previousYearWeekNumber)

  useEffect(() => {
    const fetchWeeklyExpenseData = async () => {
      const response = await axiosInstance.get("/userstats/weekly-summary/")
      const weekly_summary = response.data.weekly_summary
      const currentWeekNumber = getWeekNumber(currentDate)
      // console.log("week number" ,currentWeekNumber)
      // const previousWeekNumber = currentWeekNumber - 1;
      
      const currentWeek = `${currentYear}-${currentWeekNumber.toString().padStart(2, '0')}`
      // const previousWeek = `${currentYear}-${previousWeekNumber.toString().padStart(2, '0')}`;
      // console.log("previous week",previousWeek)

      const currentWeekSummary = weekly_summary.find((item: any) => item.week === currentWeek);
      // const previousWeekSummary = weekly_summary.find((item: any) => item.week === previousWeek);

      // console.log("Current Week", currentWeek) 
      // console.log("weekly summary data year and month", weekly_summary)
      // console.log("current week data", currentWeekSummary)
      if (currentWeekSummary){
        const categories = currentWeekSummary.expense_categories.map((category:any) => category.category)
        const amounts = currentWeekSummary.expense_categories.map((amount: any) => amount.total_amount )
        // console.log("categories", categories)
        // console.log("amounts", amounts)
        setCurrentWeekExpenseData(amounts)
        setCurrentWeekExpenseLabels(categories)
      }
      // if (previousWeekSummary){
      //   const amounts = previousWeekSummary.expense_categories.map((amount: any) => amount.total_amount);
      //   setPreviousWeekExpenseData(amounts);
      // }

      
    }
    const intervalId = setInterval(fetchWeeklyExpenseData, 1000); 

    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    const fetchMonthlyExpenseTableData = async () => {
      try {
        const response = await axiosInstance.get(`/userstats/expenses/${year}/${month}/`);
        const expenseData = response.data.expenses;
        setMonthlyExpenseTableData(expenseData);
        console.log("expenses data year and month", expenseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMonthlyExpenseTableData();
  }, [year, month]);

  const handleDateChange = (newDate: Dayjs) => {
    setYear(newDate.year());
    setMonth(newDate.month() + 1); // Months are zero-indexed in Date objects
  };

  const columns = ['Category', 'Amount', 'Description', 'Date'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  const monthTableData = monthlyExpenseTableData.map((expense) => ({
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
    date: expense.date
  }))
  

  return (
    <div style={{margin: "7rem"}}>
      {/* <div className="chart-container">
        <LineAreaChart chartTitle='Monthly Financial Overview' labels={categories} data={series} color='#FEB019'/>
      </div> */}

      <div className="row justify-content-center align-items-center">

        <div className="col-lg-6 col-sm-12 chart-container">
          <StackBarChart categories={categories} series={series} title="Monthly Financial Overview" />
        </div>
        <div className="col-lg-6">
        <ReportApexBarChart
            title={`Expense for this Week (Week ${currentYearWeekNumber})`}
            labels={currentWeekExpenseLabels}
            data={currentMonthExpenseData}
            categories={currentWeekExpenseLabels}
            colors={['#00E396', '#FEB019', '#00E396']} 
          />
        </div>
      </div>
      
  
      <div className="row justify-content-center align-items-center">
        <div className="col-lg-6 col-sm-12 mb-4">
          <ReportApexBarChart
            title="Overall Income by Source"
            labels={overallIncomeLabels}
            data={overallIncomeData}
            categories={overallIncomeLabels}
          />
        </div>
        <div className="col-lg-6 col-sm-12 mb-4">
          <ReportApexBarChart
            title="Overall Expenses by Category"
            labels={overallExpenseLabels}
            data={overallExpenseData}
            categories={overallExpenseLabels}
            colors={['#FF4560', '#FEB019', '#00E396']} 
          />
        </div>

        <div className="col-lg-6 col-sm-12 mb-4">
          <ReportApexBarChart
            title={`Income by Source In ${currentMonth}`}
            labels={currentMonthIncomeLabels}
            data={currentMonthIncomeData}
            categories={currentMonthIncomeLabels}
          />
        </div>
        <div className="col-lg-6 col-sm-12 mb-4">
          <ReportApexBarChart
            title={`Expense by Category in ${currentMonth}`}
            labels={currentMonthExpenseLabels}
            data={currentMonthExpenseData}
            categories={currentMonthExpenseLabels}
            colors={['#FF4560', '#FEB019', '#00E396']} 
          />
        </div>
        
      </div>
      {/* <div className="chart-container">
        <AreaChart title="Monthly Financial Overview" series={series} categories={categories} />
      </div>
      <div className="chart-container">
        <LineChart categories={categories} series={series} title="Monthly Financial Overview" />
      </div> */}
      
      <div className="chart-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <h1 className='text'>Monthly Expense Report</h1>
        <CustomizedTables
          columns={columns}
          rows={monthTableData}
          onDateChange={handleDateChange}
          message="No records found for the selected month and year"
        />
      </div>
    </LocalizationProvider>
      </div>
      

    </div>
  );
};

export default Reports;
