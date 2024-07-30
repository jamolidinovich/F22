import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { getOneProduct, removeProduct } from "../features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { FcClock } from "react-icons/fc";
import ClipLoader from "react-spinners/ClipLoader";
import "../../App.css";
function Home() {
  const [recipes, setRecipes] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.products.loading);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, "recipes");
        const recipesSnapshot = await getDocs(recipesCollection);
        const recipesList = recipesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesList);
        setLocalLoading(false);
      } catch (error) {
        toast.error("Error fetching recipes: " + error.message);
        setLocalLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const counts = recipes.reduce((acc, recipe) => {
      const category = recipe.category;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});
    setCategoryCounts(counts);
  }, [recipes]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "recipes", id));
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      dispatch(removeProduct(id));
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error("Error deleting recipe: " + error.message);
    }
  };

  const getAProduct = (id) => {
    const fetchRecipe = async () => {
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);
      return docSnap;
    };

    fetchRecipe().then((res) => {
      if (res?.data()?.title) {
        dispatch(getOneProduct({ ...res.data(), id, amount: 0 }));
        navigate("/recipe/" + id);
      }
    });
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={localLoading} />
      </div>
    );
  }

  return (
    <div className="container-class mt-12 sm:mt-5">
      <h1 className="text-3xl font-bold text-center items-center ml-auto mr-auto mb-12">
        Recipes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-wrap ml-auto mr-auto">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="card border-2 w-80 bg-base-100 shadow-md rounded-lg overflow-hidden ml-auto mr-auto transform transition-transform duration-300 active:scale-95 hover:shadow-xl relative"
          >
            <div onClick={() => getAProduct(recipe.id)}>
              <div className="flex justify-end px-2">
                <button
                  title="Delete product"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Are you sure you want to delete this recipe? This action cannot be undone."
                      )
                    ) {
                      handleDelete(recipe.id);
                    }
                  }}
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              </div>
              <div className="pl-4">
                <h2 className="card-title font-bold capitalize text-lg mb-2">
                  {recipe.title}
                </h2>
                <p className="text-sm line-clamp-3 w-72">
                  {recipe.method.length > 50
                    ? `${recipe.method.substring(0, 50)}...`
                    : recipe.method}
                </p>
              </div>
              <img
                src={
                  recipe.images && recipe.images.length > 0
                    ? recipe.images[0]
                    : "https://via.placeholder.com/150"
                }
                alt={recipe.title}
                className="w-full mt-20 h-32 sm:h-48 object-cover"
              />
            </div>
            <div className="absolute ml-[140px] mt-[90px]">
              <div className="flex justify-end items-center mt-4 mb-7 pr-3">
                <div className="flex items-center gap-2">
                  <button
                    title="Edit"
                    className="bg-[#81A1C1] text-black rounded-md p-1 pl-2 pr-2 text-sm flex items-center gap-[2px]"
                    onClick={() => navigate(`/create?id=${recipe.id}`)}
                  >
                    !New
                  </button>
                  <button className="bg-[#B896B3] rounded-md w-28 p-1 pl-2 pr-2 text-sm text-black flex items-center gap-[2px]">
                    <FcClock className="text-lg" />
                    {recipe.cookingTime || "N/A"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
