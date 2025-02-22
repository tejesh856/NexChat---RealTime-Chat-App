import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  subscribeToMessages: (handler) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!selectedUser || !socket) return;
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
