/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CartContext from "./CartContext";
import { getCartItems, addToCart, removeFromCart } from "../api/cart";
import toast from "react-hot-toast";

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Fetch the cart items from the backend or cookies
  const fetchCart = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const items = await getCartItems(user.email);
        setCartItems(items);
        setCartCount(items.reduce((sum, item) => sum + item.Quantity, 0));
        Cookies.set("cartItems", JSON.stringify(items), { expires: 7 });
      } catch (error) {
        toast.error("Failed to load cart");
      }
    } else {
      const storedCart = Cookies.get("cartItems");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        setCartCount(parsedCart.reduce((sum, item) => sum + item.Quantity, 0));
      }
    }
  }, [auth]);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch the cart whenever the user changes
  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  // Function to add an item to the cart
  const addItem = async (productId, quantity) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addToCart(user.email, productId, quantity);
        await fetchCart();
      } else {
        toast.error("You must be signed in to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  // Function to remove a single item from the cart
  const removeItem = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await removeFromCart(user.email, productId);
        await fetchCart();
      } else {
        toast.error("You must be signed in to remove from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  // Function to clear all selected items from the cart
  const clearSelectedItems = async (selectedItems) => {
    try {
      const user = auth.currentUser;
      if (user && selectedItems && selectedItems.length > 0) {
        await Promise.all(
          selectedItems.map((productId) =>
            removeFromCart(user.email, productId)
          )
        );
        await fetchCart();
      }
    } catch (error) {
      toast.error("Failed to clear selected items");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        addToCart: addItem,
        removeFromCart: removeItem,
        fetchCart,
        clearSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
