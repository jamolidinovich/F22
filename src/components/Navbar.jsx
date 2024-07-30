import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";
import { clear } from "../features/userSlice";
import { Link } from "react-router-dom";
import Weather from "./Weather";
import { CgAdd } from "react-icons/cg";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import {
  addProduct,
  removeProduct,
  updateProductAmount,
} from "../features/cardSlice";

const themes = {
  winter: "winter",
  dracula: "dracula",
};

function Navbar() {
  const { user } = useSelector((state) => state.currentUser);
  const { items } = useSelector((state) => state.card);
  const dispatch = useDispatch();
  const [weatherCondition, setWeatherCondition] = useState("");
  const [sum, setSum] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themeFromLocalStorage());
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to format numbers with commas
  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const calculateSum = () => {
    const total = items.reduce(
      (acc, item) => acc + item.amount * item.price,
      0
    );
    setSum(total);
  };

  useEffect(() => {
    calculateSum();
  }, [items]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Signed out successfully");
        dispatch(clear());
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  };

  const getBackgroundClass = () => {
    switch (weatherCondition) {
      case "clear":
        return "bg-clear-sky";
      case "rain":
        return "bg-rainy";
      case "clouds":
        return "bg-cloudy";
      default:
        return "bg-default-weather";
    }
  };

  const handleMode = () => {
    const newTheme =
      currentTheme === themes.winter ? themes.dracula : themes.winter;
    setCurrentTheme(newTheme);
  };

  function themeFromLocalStorage() {
    return localStorage.getItem("theme") || themes.winter;
  }

  const handleIncrement = (id) => {
    const item = items.find((item) => item.id === id);
    dispatch(updateProductAmount({ ...item, amount: item.amount + 1 }));
  };

  const handleDecrement = (id) => {
    const item = items.find((item) => item.id === id);
    if (item.amount > 1) {
      dispatch(updateProductAmount({ ...item, amount: item.amount - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeProduct(id));
  };

  return (
    <div>
      <div className={`container-class mx-auto ${getBackgroundClass()}`}>
        <div className="navbar items-center text-center justify-between p-4">
          <div className="navbar-start flex items-center text-center">
            <Link to="/">
              <span className="btn btn-ghost items-center text-2xl hidden lg:block mt-[-2px] pt-2">
                MyKitchen
              </span>
            </Link>
            <Weather setWeatherCondition={setWeatherCondition} />
          </div>
          <div className="navbar-end flex items-center">
            <div className="flex gap-6">
              <button className="" onClick={() => setModalOpen(true)}>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="badge badge-sm indicator-item">
                        {items ? items.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
              {isModalOpen && (
                <div>
                  <dialog open className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Cart Details</h3>
                      <p className="py-4">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between border-b-2 border-t-2 pt-3 pb-3"
                            >
                              <div className="flex gap-5 items-start">
                                <div>
                                  <img
                                    className="w-16 h-16 rounded-xl"
                                    src={item.images[0]}
                                    alt=""
                                  />
                                </div>
                                <div className="flex-col">
                                  <h4 className="font-bold text-xl">
                                    {item.title}
                                  </h4>
                                  <h2 className="text-blue-700 text-start ">
                                    ${formatNumber(item.price)}
                                  </h2>
                                </div>
                              </div>
                              <div className="gap-2 ">
                                <div className="flex gap-2 mb-[14px] justify-end">
                                  <button
                                    className=" btn-secondary"
                                    onClick={() => handleDecrement(item.id)}
                                  >
                                    <AiOutlineMinusCircle className="text-primary " />
                                  </button>
                                  <span>{item.amount}</span>
                                  <button
                                    className=" btn-secondary"
                                    onClick={() => handleIncrement(item.id)}
                                  >
                                    <CgAdd className="text-primary" />
                                  </button>
                                </div>
                                <div className="justify-end flex gap-2">
                                  <p className="text-blue-700 text-sm">
                                    Amount: {item.amount}
                                  </p>
                                  <button
                                    className=" text-primary"
                                    onClick={() => handleRemove(item.id)}
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No items in cart</p>
                        )}
                      </p>
                      <p className="font-bold">
                        Total Amount: ${formatNumber(sum)}
                      </p>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button onClick={() => setModalOpen(false)}>Close</button>
                    </form>
                  </dialog>
                </div>
              )}
              <div className="pt-2 btn-ghost btn-circle justify-center">
                <label className="swap swap-rotate">
                  <input
                    type="checkbox"
                    checked={currentTheme === themes.dracula}
                    onChange={handleMode}
                  />
                  {/* Sun icon */}
                  <svg
                    className="swap-on h-7 w-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                  <svg
                    className="swap-off h-7 w-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>
              </div>
              <p className="hidden lg:block mt-2">
                {user && user.displayName ? user.displayName : "Guest"}
              </p>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User avatar"
                      src={
                        user && user.photoURL
                          ? user.photoURL
                          : "https://placeimg.com/192/192/people"
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/chart" className="justify-between">
                      Chart
                    </Link>
                  </li>
                  <li>
                    <Link to="/create">Create Recipe</Link>
                  </li>
                  <li>
                    <button onClick={logOut}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
