import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { CheckAuth } from "./services/user";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, setAuthUser, connectSocket, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

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
