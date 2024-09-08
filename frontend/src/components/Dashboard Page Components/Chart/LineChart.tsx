// LineChart.tsx
import React from 'react';
import Chart from 'react-apexcharts';

interface LineChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ categories, series, title }) => {
  const options = {
    chart: {
      id: 'line-chart',
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories,
    },
    title: {
      text: title,
      align: 'center',
    },
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 4,
    },
  };

  return (
    <div className="line-chart container-fluid">
        <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12">
                <Chart options={options} series={series} type="line" height="350" />
             </div>
      </div>
    </div>
  );
};

export default LineChart;
