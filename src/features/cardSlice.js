import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.amount += action.payload.amount;
      } else {
        state.items.push(action.payload);
      }
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateProductAmount: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount = action.payload.amount;
      }
    },
  },
});

export const { addProduct, removeProduct, updateProductAmount } =
  cardSlice.actions;
export default cardSlice.reducer;
