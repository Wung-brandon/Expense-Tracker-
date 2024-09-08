import React from "react";
import ReactApexChart from "react-apexcharts";

// Reusable Chart Component Interface
interface ChartDataProps {
  data: number[];
  labels: string[];
  title?: string;
  colors?: string[];
}

const ReusableBarChart: React.FC<ChartDataProps> = ({
  data,
  labels,
  title = "Chart",
  colors = ["#4a148c", "#4CAF50"],
}) => {
  const series = [
    {
      name: "Amount",
      data,
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
      categories: labels,
    },
    colors,
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
