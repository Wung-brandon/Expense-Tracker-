import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartDataProps {
  data: number[];           // Array for income, expenses, or other data
  labels: string[];         // Labels like ["Income", "Expenses"] or ["Budget", "Expenses"]
  title?: string;           // Chart title
  colors?: string[];        // Colors for the bars
}

const ReusableBarChart: React.FC<ChartDataProps> = ({
  data,
  labels,
  title = "Chart",
  colors = ["#4a148c", "#4CAF50"],  // Default colors
}) => {
  const series = [
    {
      name: "Amount",
      data,  // Data to be displayed (income, expenses, budget, etc.)
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labels,  // Dynamically sets the categories (e.g., "Income" and "Expenses")
    },
    colors, // Dynamic colors based on props
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    yaxis: {
      title: {
        text: "Amount",
      },
      labels: {
        formatter: function (value: number) {
          return `$${value}`;
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return `$${value}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "70%",
            },
          },
          xaxis: {
            labels: {
              show: true,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="chart-container" style={{ width: "100%", height: "400px" }}>
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

export default ReusableBarChart;
