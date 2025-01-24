import { create } from "zustand";

const useTelegramStore = create((set) => ({
  botToken: "",
  chatId: "",

  setBotToken: (botToken) => set({ botToken }),
  setChatId: (chatId) => set({ chatId }),
}));

export default useTelegramStore;
