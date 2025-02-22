import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Logout } from "../services/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const Navbar = () => {
  const queryClient = useQueryClient();
  const { authUser, setAuthUser, disconnectSocket } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const { mutate: logoutTrigger } = useMutation({
    mutationFn: Logout,
    onSuccess: (data) => {
      toast.success("Logout successful! 🎉");
      console.log("Success:", data);
      setAuthUser(null);
      setSelectedUser(null);
      queryClient.cancelQueries(); // Stop any ongoing API calls
      queryClient.removeQueries(); // Remove all cached queries
      queryClient.clear();
      disconnectSocket();
      window.location.reload();
    },
  });

  return (
    <header
      className=" border-b border-base-300  
    backdrop-blur-lg bg-base-100/80"
    >
      <div
        style={{ paddingInline: 16, marginInline: "auto" }}
        className="container mx-auto h-16"
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">NexChat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              style={{ padding: 16 }}
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  style={{ padding: 16 }}
                  to={"/profile"}
                  className={`btn btn-sm gap-2`}
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => {
                    logoutTrigger();
                  }}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
