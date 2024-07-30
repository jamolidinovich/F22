import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "chartjs-plugin-datalabels";
import ApexBarChart from "../components/ApexBarChart";
import { ClipLoader } from "react-spinners";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function Chart() {
  const [nameData, setNameData] = useState({});
  const [cookingTimeData, setCookingTimeData] = useState({
    labels: [],
    datasets: [],
  });
  const [apexCategories, setApexCategories] = useState([]);
  const [apexData, setApexData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, "recipes");
        const recipesSnapshot = await getDocs(recipesCollection);
        const recipesList = recipesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const nameCount = {};
        const cookingTimes = {
          labels: [],
          datasets: [
            {
              label: "Time to Prepare (minutes)",
              data: [],
              backgroundColor: "rgba(54, 162, 235, 0.8)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        const apexCategoriesTemp = [];
        const apexDataTemp = [];
        recipesList.forEach((recipe) => {
          if (nameCount.hasOwnProperty(recipe.title)) {
            nameCount[recipe.title] += 1;
          } else {
            nameCount[recipe.title] = 1;
          }
          if (recipe.cookingTime) {
            cookingTimes.labels.push(recipe.title);
            cookingTimes.datasets[0].data.push(recipe.cookingTime);
            apexCategoriesTemp.push(recipe.title);
            apexDataTemp.push(recipe.cookingTime);
          }
        });

        console.log("Name Count: ", nameCount);
        console.log("Cooking Times: ", cookingTimes);

        setNameData(nameCount);
        setCookingTimeData(cookingTimes);
        setApexCategories(apexCategoriesTemp);
        setApexData(apexDataTemp);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const pieData = {
    labels: Object.keys(nameData),
    datasets: [
      {
        label: "Recipes by Name",
        data: Object.values(nameData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Recipe Names Distribution",
        font: {
          size: 18,
        },
        padding: {
          top: 20,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (acc, curr) => acc + curr,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} recipe(s) (${percentage}%)`;
          },
        },
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: "#fff",
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
        borderColor: "#fff",
      },
    },
  };

  const barOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Cooking Time by Recipe",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container-class mx-auto p-4 mt-20">
      <h2 className="text-center text-2xl mb-6">
        Recipe Names and Cooking Times
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <ClipLoader size={50} color={"#000"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="chart w-96 h-96 mb-12">
            <Pie data={pieData} options={pieOptions} />
          </div>

          <ApexBarChart categories={apexCategories} data={apexData} />
        </>
      )}
    </div>
  );
}

export default Chart;
