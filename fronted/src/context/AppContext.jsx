import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // ======= States =======
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({}); // { productId: quantity }
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("₹");

  // ======= Add to Cart =======
  const addToCart = (productId) => {
    setCartItems((prevItems) => {
      const quantity = prevItems[productId] || 0;
      return {
        ...prevItems,
        [productId]: quantity + 1,
      };
    });
  };

  // ======= Get Total Cart Item Count =======
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // ======= Remove Item from Cart =======
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const currentQty = prev[productId];
      if (!currentQty) return prev; // If item not in cart, do nothing

      if (currentQty === 1) {
        // Remove item completely
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      } else {
        // Decrease quantity by 1
        return {
          ...prev,
          [productId]: currentQty - 1,
        };
      }
    });
  };

  // ======= Update Cart Quantity =======
  const updateCartItem = (productId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // ======= Calculate Total Cart Amount =======
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // ======= Fetch Products (dummy fallback) =======
  const fetchProducts = async () => {
    try {
      // You can later replace this with an API call if needed
      setProducts(dummyProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ======= Context Value =======
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    searchQuery,
    setSearchQuery,
    cartItems,
    setCartItems,
    currency,
    addToCart,
    getCartAmount,
    getCartCount,
    removeFromCart,
    updateCartItem,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ======= Custom Hook =======
export const useAppContext = () => useContext(AppContext);
