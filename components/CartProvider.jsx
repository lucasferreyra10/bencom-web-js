// components/CartProvider.jsx
import React, { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const STORAGE_KEY = "bencom_cart_v1";

function loadInitial() {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        items = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }
      return { ...state, items };
    }
    case "UPDATE_QTY": {
      const { id, quantity } = action.payload;
      const items = state.items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }
    case "REMOVE_ITEM": {
      const id = action.payload;
      return { ...state, items: state.items.filter((i) => i.id !== id) };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_CART":
      return { ...state, items: action.payload || [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }, [state]);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const updateQty = (id, quantity) => dispatch({ type: "UPDATE_QTY", payload: { id, quantity } });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const getTotal = () =>
    state.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

  const getCount = () => state.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);

  return (
    <CartContext.Provider value={{ cart: state, addItem, updateQty, removeItem, clearCart, getTotal, getCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export default CartProvider;
