import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Container } from 'react-bootstrap';

interface ChartProps {
  chartTitle: string;
  labels: string[]; // X-axis labels (e.g., months or days)
  data: number[] | number;   // Y-axis data points (e.g., expenses)
  color: string;    // Color for the chart
  name : string; // Name of the chart
}

const LineAreaChart: React.FC<ChartProps> = ({ chartTitle, labels, data, color, name }) => {
  const chartData = {
    series: [
      {
        name: name,
        data: data,
      },
    ],
    options: {
      chart: {
        type: 'area',
        height: '100%',
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: labels, // Pass labels from props
        labels: {
          style: {
            colors: '#888',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `$${val.toFixed(2)}`,
          style: {
            colors: '#888',
            fontSize: '12px',
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#f1f1f1',
      },
      colors: [color], // Pass color from props
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 250,
            },
          },
        },
      ],
    },
  };

  return (
    <Container fluid className="p-3">
      <div className="card shadow-sm chart-container">
        <div className="card-body">
          <h5 className="card-title text">{chartTitle}</h5>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={350}
            
          />
        </div>
      </div>
    </Container>
  );
};

export default LineAreaChart;
