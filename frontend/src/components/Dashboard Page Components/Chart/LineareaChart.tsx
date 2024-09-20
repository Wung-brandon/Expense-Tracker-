import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Container } from 'react-bootstrap';

interface ChartProps {
  chartTitle: string;
  labels: string[]; // X-axis labels (e.g., months or days)
  data: number[] | number;   // Y-axis data points (e.g., expenses)
  color: string;    // Color for the chart
  name: string; // Name of the chart
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
        width: '100%', // Make it responsive to parent container width
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
            xaxis: {
              labels: {
                style: {
                  fontSize: '10px', // Smaller font for small screens
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: '10px',
                },
              },
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 200,
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: '9px', // Even smaller font for extra small screens
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: '9px',
                },
              },
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
            height={350} // Default height
          />
        </div>
      </div>
    </Container>
  );
};

export default LineAreaChart;
