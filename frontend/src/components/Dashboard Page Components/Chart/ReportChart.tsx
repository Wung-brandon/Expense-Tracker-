import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import "./chartContainer.css";
import { useThemeBackground } from '../../../context/BackgroundContext';

type ReusableApexBarChartProps = {
  title: string;
  labels: string[];
  data: number[];
  categories: string[];
  colors?: string[];  // Optional custom colors
};

const ReportApexBarChart: React.FC<ReusableApexBarChartProps> = ({
  title,
  labels,
  data,
  categories,
  colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
}) => {
  const { isDarkMode } = useThemeBackground();

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
      foreColor: isDarkMode ? '#808080' : '#000', // Changes all default font colors
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
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
        text: 'Amount ($)',
        style: {
          color: !isDarkMode ? '#000' : '#808080', // Y-axis title color
        },
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
    fill: {
      opacity: 1,
      colors: colors, // Apply the custom colors or default colors
    },
    grid: {
      borderColor: !isDarkMode ? '#000' : '#808080', // Change the grid line color
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`, // Tooltip value formatting
      },
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: !isDarkMode ? '#000' : '#808080', // Conditional title color
      },
    },
  };

  const chartData = [
    {
      name: title,
      data,
    },
  ];

  return (
    <div className="chart-container">
      <Chart options={chartOptions} series={chartData} type="bar" height={350} />
    </div>
  );
};

export default ReportApexBarChart;
