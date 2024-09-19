/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import TotalCard from "../../components/Dashboard Page Components/Widgets/Widgets.components";
import './DashboardPage.css'; // Ensure this file handles any additional styles
import useAxios from "../../utils/useAxios";
import { AttachMoney, AccountBalance, MoneyOff, Savings, Balance } from '@mui/icons-material';
import ReusableBarChart from "../../components/Dashboard Page Components/Chart/VersusBarChart";
// import { ProgressBar } from "react-bootstrap";
import LineAreaChart from "../../components/Dashboard Page Components/Chart/LineareaChart";
import ReportApexBarChart from "../../components/Dashboard Page Components/Chart/ReportChart";
import { Typography } from "@mui/material";

interface MonthlyDataTrend {
  month: string;
  income: number;
  expenses: number;
  budget: number;
  balance: number;
}

function DashboardPage() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);

  const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
  const [previousMonthIncome, setPreviousMonthIncome] = useState<number>(0);
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState<number>(0);

  const [currentMonthBudget, setCurrentMonthBudget] = useState<number>(0);
  const [previousMonthBudget, setPreviousMonthBudget] = useState<number>(0);

  const [currentDayExpenses, setCurrentDayExpenses] = useState<number[]>([]);

  const [monthlyData, setMonthlyData] = useState<MonthlyDataTrend[]>([]);
  const [dayData, setDayData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
 

  const axiosInstance = useAxios();

  // Function to fetch totals from the backend
  const fetchTotal = async () => {
    try {
      const response = await axiosInstance.get("/userstats/total/");
      // console.log("total", response.data);
      setTotalIncome(response.data.total_income);
      setTotalBalance(response.data.total_balance);
      setTotalBudget(response.data.total_budget);
      setTotalExpense(response.data.total_expenses);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

 
  useEffect(() => {
    fetchTotal(); 
    const intervalId = setInterval(fetchTotal, 1000); 

    return () => clearInterval(intervalId); 
  }, []);



  const fetchIncomeVsExpenses = async () => {
    try {
      const response = await axiosInstance.get("/userstats/income-vs-expenses/");
      const data = response.data.income_vs_expenses_summary;
      // console.log("income data: ", data);
      
      const today_date = new Date();
      const currentMonthStr = `${today_date.getFullYear()}-${(today_date.getMonth() + 1).toString().padStart(2, '0')}`;
      const previousMonth = today_date.getMonth() === 0 ? 12 : today_date.getMonth();
      const previousMonthYear = today_date.getMonth() === 0 ? today_date.getFullYear() - 1 : today_date.getFullYear();
      const previousMonthStr = `${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`;

      const currentMonthData = data.find((entry: { month: string; }) => entry.month === currentMonthStr) || { income: 0, expenses: 0 };
      const previousMonthData = data.find((entry: { month: string; }) => entry.month === previousMonthStr) || { income: 0, expenses: 0 };

      setCurrentMonthIncome(currentMonthData.income);
      setCurrentMonthExpenses(currentMonthData.expenses);
      setPreviousMonthIncome(previousMonthData.income);
      setPreviousMonthExpenses(previousMonthData.expenses);

    } catch (error) {
      console.error("Error fetching income vs expenses:", error);
    }
  };

  useEffect(() => {
    fetchIncomeVsExpenses();
    const intervalId = setInterval(fetchIncomeVsExpenses, 1000); 
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch budget vs expenses for current and previous month
  const fetchBudgetVsExpenses = async () => {
    try {
      const response = await axiosInstance.get("/userstats/budget-vs-expenses/");
      const data = response.data.budget_vs_expenses_summary;

      const today_date = new Date();
      const currentMonthStr = `${today_date.getFullYear()}-${(today_date.getMonth() + 1).toString().padStart(2, '0')}`;
      const previousMonth = today_date.getMonth() === 0 ? 12 : today_date.getMonth();
      const previousMonthYear = today_date.getMonth() === 0 ? today_date.getFullYear() - 1 : today_date.getFullYear();
      const previousMonthStr = `${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`;

      const currentMonthData = data.find((entry: { month: string; }) => entry.month === currentMonthStr) || { budget: 0, expenses: 0 };
      const previousMonthData = data.find((entry: { month: string; }) => entry.month === previousMonthStr) || { budget: 0, expenses: 0 };

      setCurrentMonthBudget(currentMonthData.budget);
      setPreviousMonthBudget(previousMonthData.budget);
    } catch (error) {
      console.error("Error fetching budget vs expenses:", error);
    }
  };

  useEffect(() => {
    fetchBudgetVsExpenses();
    const intervalId = setInterval(fetchBudgetVsExpenses, 1000); 
    return () => clearInterval(intervalId);
  }, []);

  const totalCards = [
    {
      title: 'Total Income',
      total: totalIncome,
      icon: AttachMoney,
      backgroundColor: '#E8F5E9',
      hoverBackgroundColor: '#4CAF50',
      iconColor: '#2E7D32',
      hoverIconColor: '#FFFFFF',
    },
    {
      title: 'Total Budget',
      total: totalBudget,
      icon: AccountBalance,
      backgroundColor: '#E3F2FD',
      hoverBackgroundColor: '#2196F3',
      iconColor: '#1565C0',
      hoverIconColor: '#FFFFFF',
    },
    {
      title: 'Total Expenses',
      total: totalExpense,
      icon: MoneyOff,
      backgroundColor: '#FFEBEE',
      hoverBackgroundColor: '#F44336',
      iconColor: '#D32F2F',
      hoverIconColor: '#FFFFFF',
    },
    {
      title: 'Total Balance',
      total: totalBalance,
      icon: Savings,
      backgroundColor: '#F3E5F5',
      hoverBackgroundColor: '#9C27B0',
      iconColor: '#6A1B9A',
      hoverIconColor: '#FFFFFF',
    },
  ];

  const date = new Date();
  const month = date.toLocaleString("default", {month: "long"})
  const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1).toLocaleString("default", {month: "long"});

  const fetchCurrentdayExpenses = async () => {
    try {
      const response = await axiosInstance.get("/userstats/current-day/");
      // console.log("Full response data: ", response.data); 
  
      const data = response.data.current_day; // Check if this path is correct
      // console.log("current day: ", data);
      
      setCurrentDayExpenses(data);
    } catch (error) {
      console.error("Error fetching current day expenses:", error);
    }
  };
  

  useEffect(() => {
    fetchCurrentdayExpenses();
    
    const intervalId = setInterval(fetchCurrentdayExpenses, 1000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId);
  }, []);
  
  

  useEffect(() => {
    const fetchMonthlyData = () => {
      axiosInstance.get("/userstats/monthly-summary/")
        .then((response) => {
          const data = response.data.monthly_summary.map((monthData: any) => ({
            month: new Intl.DateTimeFormat("en-US", { month: "long" })
              .format(new Date(monthData.month)),
            expenses: monthData.expenses,
            income: monthData.income,
            budget: monthData.budget,
            balance: monthData.balance,
          }));
          // console.log("monthData: ", data);
          setMonthlyData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    fetchMonthlyData(); // Fetch data initially

    const intervalId = setInterval(fetchMonthlyData, 1000); 
    return () => clearInterval(intervalId);
  }, []);
  const monthlyLabels = monthlyData.map((item) => item.month);
  const monthExpenseData = monthlyData.map((item) => item.expenses);
  const monthIncomeData = monthlyData.map((item) => item.income);
  const monthBudgetData = monthlyData.map((item) => item.budget)
  const monthBalanceData = monthlyData.map((item) => item.balance);

  useEffect(() => {
    // Fetch the data from the API
    const fetchDailyData = async () => {
      try {
        const response = await axiosInstance.get("/userstats/day-summary/");
        setDayData(response.data.day_data); 
        // console.log("daily data", response.data.day_data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data:', error);
        setLoading(false);
      }
    };

    fetchDailyData();
    const intervalId = setInterval(fetchDailyData, 1000); 
    return () => clearInterval(intervalId);
  }, []);
  
  const dailyLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyData = [
    dayData.Monday || 0,
    dayData.Tuesday || 0,
    dayData.Wednesday || 0,
    dayData.Thursday || 0,
    dayData.Friday || 0,
    dayData.Saturday || 0,
    dayData.Sunday || 0,
  ];
 

  // Convert the object data into arrays
  const currentDayExpenseData = Object.values(currentDayExpenses);
  const currentDayExpenseLabels:string[] = Object.keys(currentDayExpenses);

  // Check if data is available
  const hasData = currentDayExpenseData.length > 0;
  
 

  return (
    <div className="dashboard-container">
      
      
      <main className="main-content">

        <div className="row justify-content-around">
          {totalCards.map((card, index) => (
            <div key={index} className="col-lg-3 col-sm-12 col-md-6 d-flex justify-content-center align-items-center p-3">
              <TotalCard
                title={card.title}
                total={card.total}
                icon={card.icon}
                backgroundColor={card.backgroundColor}  // Pass background color
                hoverBackgroundColor={card.hoverBackgroundColor}  // Pass hover background color
                iconColor={card.iconColor}  // Pass icon color
                hoverIconColor={card.hoverIconColor}  // Pass hover icon color
              />
            </div>
          ))}
          
        </div>

       
      <div className="row ms-4 justify-content-center align-items-center">
        <div className="col-lg-6 col-sm-12">
          <LineAreaChart
            chartTitle="Daily Expenses For This Week"
            name="Expenses"
            labels={dailyLabels}
            data={dailyData}
            color="#ff5733" 
          />
        </div>
        <div className="col-lg-6 col-sm-12">
              <LineAreaChart
                chartTitle="Monthly Expense Trend"
                name="Expenses"
                labels={monthlyLabels}
                data={monthExpenseData}
                color="#33c1ff"
              />
            </div>

      </div> 
    
    <div className="row ms-4 justify-content-center align-items-center">
      <div className="col-lg-6 col-sm-12">
          <LineAreaChart
            chartTitle="Monthly Income Trend"
            name="Income"
            labels={monthlyLabels}
            data={monthIncomeData}
            color="#ff69b4"
          />
      </div>

      <div className="col-lg-6 col-sm-12">
        <LineAreaChart
          chartTitle="Monthly Budget Trend"
          name="Budget"
          labels={monthlyLabels}
          data={monthBudgetData}
          color="#ffc107"
        />
      </div>
    </div>

    <div className="row ms-4 justify-content-center align-items-center">
    <div className="col-lg-6 col-sm-12">
        <LineAreaChart
          chartTitle="Monthly Balance Trend"
          name="Balance"
          labels={monthlyLabels}
          data={monthBalanceData}
          color="#38812f"
        />
      </div>
      <div className="col-lg-6 col-sm-12">
              {hasData ? (
                  <ReusableBarChart
                    title={`Expenses for Today (${new Date().toLocaleDateString()})`}
                    labels={currentDayExpenseLabels}
                    data={currentDayExpenseData}
                    colors={['#FEB019',  '#00E396']} 
                  />
                ) : (
                  <div className="text-center">
                    <Typography color="error" sx={{fontSize:"1.5rem"}}>No expense data available for today.</Typography>
                  </div>
                )}
            </div>
    </div>

        <div className="row ms-4 justify-content-center align-items-center">
            <div className="col-lg-6 col-sm-12">
              <ReusableBarChart
                data={[currentMonthIncome, currentMonthExpenses]}
                labels={["Income", "Expenses"]}
                title={`Income vs Expenses in ${month}`}
                colors={["#4a148c", "#F44336"]}
              />
            </div>
            <div className="col-lg-6 col-sm-12">
                <ReusableBarChart
                  data={[previousMonthIncome, currentMonthIncome]}
                  labels={[previousMonth, month]}
                  title={`Income Comparison: ${previousMonth} vs ${month}`}
                  colors={["#4a148c", "#F44336"]}
                />
             </div>
            
          </div>
        
          <div className="row ms-4 mt-4 justify-content-center align-items-center">
            <div className="col-lg-6 col-sm-12">
              <ReusableBarChart
                data={[currentMonthIncome, currentMonthBudget]}
                labels={["Income", "Budget"]}
                title={`Income vs Budget in ${month}`}
                colors={["#3F51B5", "#F44336"]}
              />
            </div>
            <div className="col-lg-6 col-sm-12">
            <ReusableBarChart
                data={[previousMonthBudget, currentMonthBudget]}
                labels={[previousMonth, month]}
                title={`Budget Comparison: ${previousMonth} vs ${month}`}
                colors={["#3F51B5", "#F44336"]}
              />
            </div>
          </div>
          <div className="row ms-4 mt-4 justify-content-center align-items-center">
            <div className="col-lg-6 col-sm-12">
              <ReusableBarChart
                data={[currentMonthBudget, currentMonthExpenses]}
                labels={["Budget", "Expenses"]}
                title={`Budget vs Expenses in ${month}`}
                colors={["#4CAF50", "#F44336"]}
              />
            </div>
            <div className="col-lg-6 col-sm-12">
              <ReusableBarChart
                  data={[previousMonthExpenses, currentMonthExpenses]}
                  labels={[previousMonth, month]}
                  title={`Expense Comparison: ${previousMonth} vs ${month}`}
                  colors={["#4CAF50", "#F44336"]}
                />
            </div>
          </div>
          
      </main>
      
    </div>
  );
}

export default DashboardPage;
