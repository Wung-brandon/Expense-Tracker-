import React from "react";
import Chart from "react-apexcharts";

interface AreaChartProps {
  title: string;
  series: Array<{ name: string; data: number[] }>;
  categories: string[];
}

const AreaChart: React.FC<AreaChartProps> = ({ title, series, categories }) => {
  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
      },
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
    },
    yaxis: {
      title: {
        text: "Amount",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`, // Format numbers as currency
      },
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
      <h2 className="text-center mt-4">{title}</h2>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <Chart options={options} series={series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default AreaChart;
