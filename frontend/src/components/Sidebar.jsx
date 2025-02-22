import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getUsers } from "../services/message";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { getInitials } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Sidebar() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { isPending, data, isError } = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
    enabled: !!authUser,
  });

  const filteredUsers = showOnlineOnly
    ? data?.users.filter((user) => onlineUsers.includes(user._id))
    : data?.users;

  if (isPending) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div
        style={{ padding: 20 }}
        className="border-b border-base-300 w-full p-5"
      >
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div
          style={{ marginTop: 12 }}
          className="mt-3 hidden lg:flex items-center gap-2"
        >
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div style={{ paddingBlock: 12 }} className="overflow-y-auto w-full py-3">
        {filteredUsers?.map((user) => (
          <button
            style={{ padding: 12 }}
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center  gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
              ) : (
                <div
                  className="size-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: user.color || "transparent" }} // Default gray if color is not provided
                >
                  {getInitials(user.fullName)}
                </div>
              )}
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div
            style={{ paddingBlock: 16 }}
            className="text-center text-zinc-500 py-4"
          >
            No online users
          </div>
        )}
      </div>
    </aside>
  );
}
