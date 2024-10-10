import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import propTypes from "prop-types";
const ContributionChart = ({ contributions }) => {
  const chartRef = useRef(null);

  const data = {
    labels: contributions.map((contribution) => contribution.date), // dates of contributions
    datasets: [
      {
        label: "Contributions",
        data: contributions.map((contribution) => contribution.count), // contribution counts
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Cleanup the chart instance on unmount
  useEffect(() => {
    const chartInstance = chartRef.current;

    return () => {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy chart instance
      }
    };
  }, [chartRef]);

  return <Line ref={chartRef} data={data} options={options} />;
};

ContributionChart.propTypes = {
  contributions: propTypes.array.isRequired,
};

export default ContributionChart;
