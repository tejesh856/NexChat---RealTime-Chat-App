import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckAuth } from "./services/user";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, setAuthUser, connectSocket, socket } = useAuthStore();
  const { theme } = useThemeStore();
  const { selectedUser, incrementUnreadCount, clearUnreadCount } = useChatStore();
  const queryClient = useQueryClient();

  const { isPending, data, isError, refetch } = useQuery({
    queryKey: ["checkAuth"],
    queryFn: CheckAuth,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.user) {
      setAuthUser(data.user);
      connectSocket();
    } else if (isError) {
      setAuthUser(null);
    }
  }, [data, isError, setAuthUser]);

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleIncomingMessage = (message) => {
      if (!message || !message.senderId || !message.receiverId) return;

      const isOwnMessage = message.senderId === authUser._id;
      const conversationPartner = isOwnMessage ? message.receiverId : message.senderId;
      const queryKey = ["getMessages", conversationPartner];

      queryClient.setQueryData(queryKey, (oldData) => {
        const existingMessages = oldData?.messages || [];
        if (existingMessages.some((msg) => msg._id === message._id)) return oldData;
        return {
          ...(oldData || { success: true }),
          messages: [...existingMessages, message],
        };
      });

      if (selectedUser?._id === conversationPartner) {
        if (!isOwnMessage) {
          clearUnreadCount(conversationPartner);
        }
      } else if (!isOwnMessage) {
        incrementUnreadCount(conversationPartner);
      }
    };

    socket.on("newMessage", handleIncomingMessage);
    return () => socket.off("newMessage", handleIncomingMessage);
  }, [socket, authUser, selectedUser, incrementUnreadCount, clearUnreadCount, queryClient]);

  useEffect(() => {
    console.log("authUser", authUser);
    refetch();
  }, [authUser, refetch]);

  if (isPending && !authUser) {
    return (
      <div
        data-theme={theme}
        className="flex-1 flex items-center justify-center"
      >
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="flex flex-col flex-1">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
