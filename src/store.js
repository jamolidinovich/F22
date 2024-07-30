import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import productsReducer from "./features/productSlice";
import cardReducer from "./features/cardSlice";
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch (err) {}
};

export const store = configureStore({
  reducer: {
    currentUser: userReducer,
    products: productsReducer,
    card: cardReducer,
  },
});

store.subscribe(() => {
  saveState(store.getState().products);
});
