import React from "react";
import ReactApexChart from "react-apexcharts";

export const CurrentMonthChart: React.FC<{ data: { budget: number; expenses: number } }> = ({ data }) => {
  const series = [
    {
      name: "Budget",
      data: [data.budget]
    },
    {
      name: "Expenses",
      data: [data.expenses]
    }
  ];

  const options = {
    chart: {
      type: "bar",
      height: 400
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%"
      }
    },
    xaxis: {
      categories: ["Current Month"]
    },
    title: {
      text: "Current Month Budget vs Expenses",
      align: "center"
    }
  };

  return (
    <div className="chart-container tablecell">
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

