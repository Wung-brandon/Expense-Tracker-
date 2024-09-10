import { colors } from "@mui/material";
import React from "react";
import Chart from "react-apexcharts";
import { useThemeBackground } from "../../../context/BackgroundContext";

interface AreaChartProps {
  title?: string;
  series: Array<{ name: string; data: number[] }>;
  categories: string[];
}

const AreaChart: React.FC<AreaChartProps> = ({ title, series, categories }) => {
  const {isDarkMode} = useThemeBackground()
  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
      },
      foreColor: !isDarkMode ? '#000' : '#808080',
    },
    colors: ["#00E396", "#FF4560", "#008FFB", "#FEB019"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: categories, // Months on the X-axis
      labels: {
        style: {
          colors: !isDarkMode ? '#000' : '#808080', // Conditional X-axis label color
        },
      },
      axisBorder: {
        color: !isDarkMode ? '#000' : '#808080', // X-axis border color
      },
      axisTicks: {
        color: !isDarkMode ? '#000' : '#808080', // X-axis ticks color
      },
      
    },
    yaxis: {
      title: {
        text: "Amount",
        style: {
          color: !isDarkMode ? '#000' : '#808080', // Y-axis title color
        },
        labels: {
          style: {
            colors: !isDarkMode ? '#000' : '#808080', // Conditional Y-axis label color
          },
          formatter: (val) => `$${val}`, // Format the Y-axis values with a dollar sign
        },
        axisBorder: {
          color: !isDarkMode ? '#000' : '#808080', // Y-axis border color
        },
        axisTicks: {
          color: !isDarkMode ? '#000' : '#808080', // Y-axis ticks color
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`, // Format numbers as currency
      },
    },
    grid: {
      borderColor: !isDarkMode ? '#000' : '#808080', // Change the grid line color
    },
    fill: {
      opacity: 0.8,
    },
    legend: {
      position: "top",
    },
  };

  return (
    <div className="container-fluid">
      <h2 className="text-center mt-4 text">{title}</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <Chart options={options} series={series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default AreaChart;
