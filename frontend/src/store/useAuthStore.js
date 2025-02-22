import { create } from "zustand";
import { io } from "socket.io-client";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }),
  onlineUsers: [],
  socket: null,
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(
      import.meta.env.MODE === "development"
        ? `${import.meta.env.VITE_API_URL}`
        : "/",
      {
        query: {
          userId: authUser._id,
        },
      }
    );
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
