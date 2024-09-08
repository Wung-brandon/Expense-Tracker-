// CombinationChart.tsx
import React from 'react';
import Chart from 'react-apexcharts';

interface CombinationChartProps {
  categories: string[];
  barSeries: { name: string; data: number[] }[];
  lineSeries: { name: string; data: number[] }[];
  title: string;
}

const CombinationChart: React.FC<CombinationChartProps> = ({ categories, barSeries, lineSeries, title }) => {
  const options = {
    chart: {
      id: 'combo-chart',
      toolbar: { show: true },
    },
    xaxis: { categories },
    title: { text: title, align: 'center' },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    markers: { size: 4 },
    stroke: { curve: 'smooth' },
  };

  return (
    <div className="container-fluid">
        <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12">
                <Chart
                options={options}
                series={[...barSeries, ...lineSeries]}
                type="line"
                height="350"
                />
            </div>
        </div>
    </div>
   

  );
};

export default CombinationChart;
