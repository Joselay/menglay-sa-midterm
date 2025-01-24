import { create } from "zustand";

const useStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("https://fakestoreapi.com/products?limit=5");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useStore;
