import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShopContext = createContext(null);
export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("maviina_cart") || "[]") : []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("maviina_wishlist") || "[]") : []; } catch { return []; }
  });
  useEffect(() => { window.localStorage.setItem("maviina_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem("maviina_wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  const addToCart = (product) => setCart((items) => {
    const existing = items.find((item) => item.id === product.id);
    return existing ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }];
  });
  const removeFromCart = (id) => setCart((items) => items.filter((item) => item.id !== id));
  const changeQuantity = (id, quantity) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
  const toggleWishlist = (product) => setWishlist((items) => items.some((item) => item.id === product.id) ? items.filter((item) => item.id !== product.id) : [...items, product]);
  const value = useMemo(() => ({ cart, wishlist, addToCart, removeFromCart, changeQuantity, toggleWishlist }), [cart, wishlist]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
export function useShop() { const value = useContext(ShopContext); if (!value) throw new Error("useShop must be used within ShopProvider"); return value; }
