
import ReactApexChart from "react-apexcharts";
import { useThemeBackground } from "../../../context/BackgroundContext";

// Reusable Chart Component Interface
interface ChartDataProps {
  data: number[];
  labels: string[];
  title?: string;
  colors?: string[];
}

const ReusableBarChart: React.FC<ChartDataProps> = ({
  data,
  labels,
  title = "Chart",
  colors = ["#4a148c", "#4CAF50"],
}) => {
  const {isDarkMode} = useThemeBackground()

  const series = [
    {
      name: "Amount",
      data,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: {
        show: false,
      },
      foreColor: isDarkMode ? "#808080" : "#000", 
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labels,
    },
    colors: colors, 
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: isDarkMode ? "#808080" : "#000", 
      },
    },
    yaxis: {
      title: {
        text: "Amount",
        style: {
          color: isDarkMode ? "##808080" : "#000", 
        },
      },
      labels: {
        formatter: function (value: number) {
          return `$${value}`;
        },
        style: {
          colors: isDarkMode ? "#808080" : "#000", 
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return `$${value}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "70%",
            },
          },
          xaxis: {
            labels: {
              show: true,
              style: {
                colors: isDarkMode ? "#808080" : "#000", 
              },
            },
          },
        },
      },
    ],
  };

  return (
    <div className="chart-container" style={{ width: "100%", height: "400px" }}>
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

export default ReusableBarChart;
