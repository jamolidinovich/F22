import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { BsCart3 } from "react-icons/bs";
import { addProduct, updateProductAmount } from "../features/cardSlice";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { CgAdd } from "react-icons/cg";
import { FadeLoader } from "react-spinners";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.card);
  const existingProduct = items.find((item) => item.id === id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe(data);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setTotalPrice(recipe.price * amount);
    }
  }, [amount, recipe]);

  const handleAddToCart = () => {
    if (existingProduct) {
      dispatch(updateProductAmount({ ...existingProduct, amount }));
    } else {
      dispatch(addProduct({ ...recipe, id, amount }));
    }
  };

  const handleIncrement = () => {
    setAmount((prevAmount) => prevAmount + 1);
  };

  const handleDecrement = () => {
    setAmount((prevAmount) => (prevAmount > 1 ? prevAmount - 1 : 1));
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FadeLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-center">Recipe not found</div>;
  }

  return (
    <div>
      <div className="container-class mt-20 ">
        <div>
          <h1 className="text-3xl font-bold mb-6">Recipe Elements</h1>

          <div className="carousel carousel-center h-80 p-4 space-x-4 bg-neutral rounded-box">
            {recipe.images && recipe.images.length > 0 ? (
              recipe.images.map((image, index) => (
                <div className="carousel-item" key={index}>
                  <img
                    src={image}
                    className="rounded-box w-80"
                    alt={`carousel-item-${index}`}
                    width={604}
                    height={246}
                  />
                </div>
              ))
            ) : (
              <div className="carousel-item">
                <img
                  src="https://via.placeholder.com/604x246"
                  className="rounded-box"
                  alt="placeholder"
                  width={604}
                  height={246}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mt-6 mb-6">{recipe.title}</h1>
              <div className="flex items-center">
                <strong>Ingredients:</strong>
                <ul className="list-none ml-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <p className="text-lg mt-4">
                <strong>Cooking Time:</strong> {recipe.cookingTime}
              </p>
              <p className="text-lg mt-6 ml-auto mr-auto">{recipe.method}</p>
            </div>
            <div className="mt-8 flex gap-9 items-center">
              <div className="flex gap-4 text-2xl">
                <button className=" btn-secondary" onClick={handleDecrement}>
                  <AiOutlineMinusCircle className="text-2xl text-orange-500 " />
                </button>
                <span>{amount}</span>
                <button
                  className=" btn-secondary text-orange-500"
                  onClick={handleIncrement}
                >
                  <CgAdd className="text-2xl"></CgAdd>
                </button>
              </div>
              <button
                className="btn btn-secondary text-white bg-orange-500 border-none w-48 add"
                onClick={handleAddToCart}
              >
                <BsCart3 />
                Add to Cart
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleBack} className="btn btn-secondary mb-4">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
