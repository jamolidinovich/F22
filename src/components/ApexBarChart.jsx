import React from "react";
import ApexCharts from "react-apexcharts";

function ApexBarChart({ categories, data }) {
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    title: {
      text: "Cooking Time by Recipe",
      align: "left",
    },
  };

  const series = [
    {
      name: "Cooking Time (minutes)",
      data: data,
    },
  ];

  return (
    <div className="container mx-auto p-4 mt-20">
      <h2 className="text-center text-2xl mb-6">Cooking Time by Recipe</h2>
      <div id="chart">
        <ApexCharts options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
}

export default ApexBarChart;
