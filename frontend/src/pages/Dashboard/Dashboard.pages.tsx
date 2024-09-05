import { useEffect, useState } from "react";
import Sidebar from "../../components/Dashboard Page Components/Sidebar/Sidebar.components";
import TotalCard from "../../components/Dashboard Page Components/Widgets/Widgets.components";
import './DashboardPage.css'; // Ensure this file handles any additional styles
import useAxios from "../../utils/useAxios";
import { AttachMoney, AccountBalance, MoneyOff, Savings } from '@mui/icons-material';
import { Outlet } from "react-router-dom";
import ReusableBarChart from "../../components/Dashboard Page Components/Chart/VersusBarChart";



function DashboardPage() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);

  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);

  const [currentMonthData, setCurrentMonthData] = useState<{ budget: number; expenses: number }>({ budget: 0, expenses: 0 });
  const [previousMonthData, setPreviousMonthData] = useState<{ budget: number; expenses: number }>({ budget: 0, expenses: 0 });



  const incomeVsExpensesData = {
    data: [income, expenses],  
    labels: ["Income", "Expenses"],
    title: "Income vs Expenses",
    colors: ["#4a148c", "#F44336"], 
  };

  const budgetVsExpensesData = {
    data: [budget, expenses],  
    labels: ["Budget", "Expenses"],
    title: "Budget vs Expenses",
    colors: ["#3F51B5", "#F44336"], 
  };

  const axiosInstance = useAxios();

  // Function to fetch totals from the backend
  const fetchTotal = async () => {
    try {
      const response = await axiosInstance.get("/userstats/total/");
      console.log("total", response.data);
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
      const data = response.data["income-vs-expenses data"];
      setIncome(data.income["9"]);
      setExpenses(data.expenses["9"]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchIncomeVsExpenses();
    const intervalId = setInterval(fetchIncomeVsExpenses, 1000); // Polling every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchBudgetVsExpenses = async () => {
    try {
      const response = await axiosInstance.get("/userstats/budget-vs-expenses/");
      const data = response.data["budget_vs_expenses_summary"];
      
      // Get the current month
      const today_date = new Date();
      const currentMonthStr = `${today_date.getFullYear()}-${(today_date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Find data for the current month and previous month
      const currentMonthData = data.find(entry => entry.month === currentMonthStr) || { budget: 0, expenses: 0 };
      const previousMonth = today_date.getMonth() === 0 ? 12 : today_date.getMonth(); // Handle December
      const previousMonthYear = today_date.getMonth() === 0 ? today_date.getFullYear() - 1 : today_date.getFullYear();
      const previousMonthStr = `${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`;
      const previousMonthData = data.find(entry => entry.month === previousMonthStr) || { budget: 0, expenses: 0 };
      
      setCurrentMonthData(currentMonthData);
      setPreviousMonthData(previousMonthData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchBudgetVsExpenses();
    const intervalId = setInterval(fetchBudgetVsExpenses, 1000); // Polling every second
  
    return () => clearInterval(intervalId);
  }, []);

  const totalCards = [
    { title: `Total Income`, total: totalIncome, icon: AttachMoney },
    { title: `Total Budget`, total: totalBudget, icon: AccountBalance },
    { title: `Total Expenses`, total: totalExpense, icon: MoneyOff },
    { title: `Total Balance`, total: totalBalance, icon: Savings },
  ];

  const date = new Date();
  const month = date.toLocaleString("default", {month: "long"})

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="row justify-content-around">
          {totalCards.map((card, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-3 mb-4 d-flex justify-content-center align-items-center p-3">
              <TotalCard
                title={card.title}
                total={card.total}
                icon={card.icon}
              />
            </div>
          ))}
          
        </div>
        <div className="row ms-4 justify-content-center align-items-center">
            <div className="col-lg-6 col-sm-12">
             <ReusableBarChart
              data={incomeVsExpensesData.data}
              labels={incomeVsExpensesData.labels}
              title={`${incomeVsExpensesData.title} In The Month Of ${month}`}
              colors={incomeVsExpensesData.colors}
            />
            </div>
            <div className="col-lg-6 col-sm-12">
            <ReusableBarChart
              data={budgetVsExpensesData.data}
              labels={budgetVsExpensesData.labels}
              title={`${budgetVsExpensesData.title} In The Month Of ${month}`}
              colors={budgetVsExpensesData.colors}
            />
            </div>
          </div>
      </main>
      <Outlet />
    </div>
  );
}

export default DashboardPage;
