/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import useAxios from '../../utils/useAxios';
import ReportApexBarChart from '../../components/Dashboard Page Components/Chart/ReportChart';
// import AreaChart from '../../components/Dashboard Page Components/Chart/AreaChart';
// import LineChart from '../../components/Dashboard Page Components/Chart/LineChart';
import StackBarChart from '../../components/Dashboard Page Components/Chart/StackBarChart';
// import { ProgressBar } from 'react-bootstrap';

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

  const [year, setYear] = useState<number>(currentYear)
  const [month, setMonth] = useState<number>(monthNumber)
  
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
          month: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })
            .format(new Date(monthData.month)),
          income: monthData.income,
          expenses: monthData.expenses,
          budget: monthData.budget,
          // balance: monthData.income - monthData.expenses, 
        }));
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

  const columns = [
    // { id: 'id', label: 'Id', numeric: true },
    { id: 'amount', label: 'Amount', numeric: true },
    { id: 'date', label: 'Date', numeric: false },
    { id: 'category', label: 'Category', numeric: false },
    { id: 'description', label: 'Description', numeric: false },
  ];

  useEffect(() => {
    const fetchMonthlyExpenseTableData = async () => {
      const response = await axiosInstance.get(`/userstats/expenses/${year}/${month}/`)
      const expenseData = response.data.expenses
      // console.log("expenses data year and month", expenseData)
      setMonthlyExpenseTableData(expenseData)
    }

    const intervalId = setInterval(fetchMonthlyExpenseTableData, 1000); 

    return () => clearInterval(intervalId);
  }, [])

  

  
  

  return (
    <div style={{margin: "7rem"}}>
  
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
        <StackBarChart categories={categories} series={series} title="Monthly Financial Overview" />
      </div>

    </div>
  );
};

export default Reports;
