import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (product, quantity) =>
    set((state) => {
      const existingProductIndex = state.cart.findIndex(
        (item) => item.id === product.id
      );
      let updatedCart;
      if (existingProductIndex !== -1) {
        updatedCart = [...state.cart];
        updatedCart[existingProductIndex].quantity += quantity;
      } else {
        updatedCart = [...state.cart, { ...product, quantity }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  getTotalPrice: () => {
    return get().cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  },

  getUniqueItemsCount: () => {
    const uniqueItems = new Set(get().cart.map((item) => item.id));
    return uniqueItems.size;
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem("cart");
  },

  loadCart: () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      set({ cart: JSON.parse(savedCart) });
    }
  },
}));

export default useCartStore;
