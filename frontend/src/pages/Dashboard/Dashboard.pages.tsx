import { useEffect, useState } from "react";
import Sidebar from "../../components/Dashboard Page Components/Sidebar/Sidebar.components";
import TotalCard from "../../components/Dashboard Page Components/Widgets/Widgets.components";
import './DashboardPage.css'; // Ensure this file handles any additional styles
import useAxios from "../../utils/useAxios";
import { AttachMoney, AccountBalance, MoneyOff, Savings } from '@mui/icons-material';
import ReusableBarChart from "../../components/Dashboard Page Components/Chart/VersusBarChart";

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
      console.log("income data: ", data);
      
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
    { title: `Total Income`, total: totalIncome, icon: AttachMoney },
    { title: `Total Budget`, total: totalBudget, icon: AccountBalance },
    { title: `Total Expenses`, total: totalExpense, icon: MoneyOff },
    { title: `Total Balance`, total: totalBalance, icon: Savings },
  ];

  const date = new Date();
  const month = date.toLocaleString("default", {month: "long"})
  const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1).toLocaleString("default", {month: "long"});

  return (
    <div className="dashboard-container">
      {/* <Sidebar /> */}
      
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
      </main>
      
    </div>
  );
}

export default DashboardPage;
