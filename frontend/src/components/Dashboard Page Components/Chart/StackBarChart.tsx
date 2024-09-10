// BarChart.tsx
import React from 'react';
import Chart from 'react-apexcharts';
import { useThemeBackground } from '../../../context/BackgroundContext';

interface BarChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  title: string;
  stacked?: boolean;
}

const StackBarChart: React.FC<BarChartProps> = ({ categories, series, title, stacked = false }) => {
  const {isDarkMode} = useThemeBackground()
  const options = {
    chart: {
      id: 'bar-chart',
      toolbar: { show: true },
      stacked: stacked,
      foreColor: !isDarkMode ? '#000' : '#808080',
    },
    xaxis: { categories },
    title: { text: title, align: 'center' },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
  };

  return (
    <div className="container-fluid">
        <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12">
                <Chart options={options} series={series} type="bar" height="350" />
            </div>
        </div>
    </div>
    

  );
};

export default StackBarChart;
