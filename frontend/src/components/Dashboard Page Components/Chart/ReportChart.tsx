// File: src/components/Charts/ReusableApexBarChart.tsx
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import "./chartContainer.css"
// import './ReusableApexBarChart.css'; 

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
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
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
    },
    yaxis: {
      title: {
        text: 'Amount ($)',
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
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
