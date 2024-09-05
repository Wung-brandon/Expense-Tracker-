import React from 'react';
import Chart from 'react-apexcharts';

// Define the props for the PieChart component
interface PieChartProps {
  data: number[];
  labels: string[];
  title: string;
}

// Create a reusable PieChart component
const PieChart: React.FC<PieChartProps> = ({ data, labels, title }) => {
  // Define the chart options and series
  const chartOptions = {
    chart: {
      type: 'pie',
      height: '100%',
    },
    labels,
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333', // Adjust title color
      },
    },
    colors: [
      '#FF6384', // Custom colors for the chart slices
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '80%',
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
          },
        },
      },
    ],
    legend: {
      position: 'bottom', // Position the legend below the chart
      horizontalAlign: 'center',
      floating: false, // Ensure the legend does not float over the chart
      fontSize: '14px',
      labels: {
        colors: '#333',
      },
    },
  };

  // Prepare the data series for the chart
  const chartSeries = data;

  return (
    <div className="pie-chart-container" style={{ padding: '20px', width: '100%' }}>
      <Chart options={chartOptions} series={chartSeries} type="pie" height={380} />
    </div>
  );
};

export default PieChart;

