import Sidebar from "../../components/Dashboard Page Components/Sidebar/Sidebar.components";
import Widgets from "../../components/Dashboard Page Components/Widgets/Widgets.components";
import './DashboardPage.css'; // Ensure this file handles any additional styles

function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Widgets />
        <p>hello</p>
      </main>
    </div>
  );
}

export default DashboardPage;
