import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  selectedUser: null,
  unreadCounts: {},
  setSelectedUser: (user) =>
    set((state) => {
      const nextState = { selectedUser: user };
      if (user) {
        const { [user._id]: _, ...remaining } = state.unreadCounts;
        nextState.unreadCounts = remaining;
      }
      return nextState;
    }),
  incrementUnreadCount: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
  clearUnreadCount: (userId) =>
    set((state) => {
      const { [userId]: _, ...remaining } = state.unreadCounts;
      return { unreadCounts: remaining };
    }),

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
    if (socket) socket.off("newMessage");
  },
}));
