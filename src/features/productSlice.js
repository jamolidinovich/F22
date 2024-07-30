import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  price: 0,
  product: {
    id: null,
    amount: 1,
    price: 0,
  },
  loading: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    increaseAmount: (state) => {
      state.product.amount += 1;
    },
    decreaseAmount: (state) => {
      if (state.product.amount > 1) {
        state.product.amount -= 1;
      }
    },
    calculateTotal: (state) => {
      const totalPrice = state.products.reduce((total, product) => {
        return total + product.price * product.amount;
      }, 0);
      state.price = totalPrice;
    },
    addProduct: (state, action) => {
      const { id, amount, price } = action.payload;
      const existingProduct = state.products.find((item) => item.id === id);
      if (existingProduct) {
        existingProduct.amount += amount;
      } else {
        state.products.push({ id, amount, price });
      }
      state.product = initialState.product;
      productsSlice.caseReducers.calculateTotal(state);
      productsSlice.caseReducers.addItems(state);
    },
    addItems: (state) => {
      localStorage.setItem("items", JSON.stringify(state.products));
    },
    getProduct: (state) => {
      const itemsStorage = JSON.parse(localStorage.getItem("items"));
      if (itemsStorage) {
        state.products = itemsStorage;
        productsSlice.caseReducers.calculateTotal(state);
      }
    },
    removeProduct: (state, action) => {
      state.loading = true;
      const productIdToRemove = action.payload;
      const updatedProducts = state.products.filter(
        (product) => product.id !== productIdToRemove
      );
      state.products = updatedProducts;
      productsSlice.caseReducers.calculateTotal(state);
      productsSlice.caseReducers.addItems(state);
      state.loading = false;
    },
    getOneProduct: (state, action) => {
      state.product = { ...action.payload, amount: 1 };
    },
  },
});

export const {
  increaseAmount,
  decreaseAmount,
  calculateTotal,
  addProduct,
  addItems,
  getProduct,
  removeProduct,
  getOneProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
