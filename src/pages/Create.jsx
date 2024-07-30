import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ingredient, setIngredient] = useState("");
  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [image, setImage] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [recipeId, setRecipeId] = useState("");
  const [methodCharCount, setMethodCharCount] = useState(0);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) {
      setEditMode(true);
      setRecipeId(id);
      const fetchRecipe = async () => {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setMethod(data.method);
          setCookingTime(data.cookingTime.replace(" minutes", ""));
          setPrice(data.price || "");
          setIngredients(data.ingredients || []);
          setImages(data.images || []);
        }
      };
      fetchRecipe();
    }
  }, [location.search]);

  const addIngredient = (e) => {
    e.preventDefault();
    if (ingredient.trim()) {
      if (!ingredients.includes(ingredient.trim())) {
        setIngredients((prev) => [...prev, ingredient.trim()]);
        toast.success("Ingredient added successfully");
      } else {
        toast.error("Ingredient already exists");
      }
    } else {
      toast.error("Ingredient cannot be empty");
    }
    setIngredient("");
  };

  const addImage = (e) => {
    e.preventDefault();
    if (image.trim()) {
      if (!images.includes(image.trim())) {
        setImages((prev) => [...prev, image.trim()]);
        toast.success("Image URL added successfully");
      } else {
        toast.error("Image URL already exists");
      }
    } else {
      toast.error("Image URL cannot be empty");
    }
    setImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !method ||
      images.length < 2 ||
      !cookingTime ||
      !price ||
      ingredients.length === 0
    ) {
      toast.error("Please fill all fields and add at least two images");
      return;
    }

    const newRecipe = {
      title,
      method,
      images,
      cookingTime: `${cookingTime} minutes`,
      price,
      ingredients,
      categories,
    };

    try {
      if (editMode) {
        // Update the recipe
        const docRef = doc(db, "recipes", recipeId);
        await updateDoc(docRef, newRecipe);
        toast.success("Recipe updated successfully!");
      } else {
        // Add new recipe
        await addDoc(collection(db, "recipes"), newRecipe);
        toast.success("Recipe added successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error("Error saving recipe: " + error.message);
    }
  };

  // Update character count when method changes
  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setMethod(newMethod);
    setMethodCharCount(newMethod.length);
  };

  return (
    <div className="cardAdd mx-auto mt-20 w-full max-w-2xl p-4 md:w-2/3 lg:w-1/2">
      <h1 className="text-2xl text-center font-bold mb-6">
        {editMode ? "Update Recipe" : "Create New Recipe"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full h-15 max-w-full"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Ingredients:</span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full h-15 max-w-full"
              onChange={(e) => setIngredient(e.target.value)}
              value={ingredient}
            />
            <button className="btn btn-primary" onClick={addIngredient}>
              Add
            </button>
          </div>
          <div className="mt-1">
            <p className="break-words">
              Ingredients:{" "}
              {ingredients.map((ing, index) => (
                <span className="inline-block mr-2" key={index}>
                  {ing}
                </span>
              ))}
            </p>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Cooking Time</span>
          </div>
          <input
            type="number"
            placeholder="Type here"
            className="input input-bordered h-15 w-full max-w-full"
            onChange={(e) => setCookingTime(e.target.value)}
            value={cookingTime}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Price:</span>
          </div>
          <input
            type="number"
            placeholder="Type here"
            className="input input-bordered h-15 w-full max-w-full"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Image URL:</span>
          </div>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="Type here"
              className="input input-bordered w-full h-15 max-w-full"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />
            <button className="btn btn-primary" onClick={addImage}>
              Add
            </button>
          </div>
          <div className="mt-1">
            <p className="break-words">
              Images:{" "}
              {images.map((img, index) => (
                <span className="inline-block mr-2" key={index}>
                  {img}
                </span>
              ))}
            </p>
          </div>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Method</span>
          </div>
          <textarea
            className="textarea textarea-bordered h-24 w-full max-w-full"
            placeholder="Describe the method (up to 30 characters)"
            onChange={handleMethodChange}
            value={method}
            maxLength={40}
          ></textarea>
          <p className="text-sm mt-1">{methodCharCount}/40 characters</p>
        </label>
        <button type="submit" className="btn btn-secondary w-full mt-4 mb-3">
          {editMode ? "Update Recipe" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Create;
