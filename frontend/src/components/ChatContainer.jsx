import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "../services/message";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, getInitials } from "../lib/utils";

export default function ChatContainer() {
  const queryClient = useQueryClient();
  const messageEndRef = useRef(null);
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const { isPending, data, isError } = useQuery({
    queryKey: ["getMessages", selectedUser?._id],
    queryFn: () => getMessages(selectedUser?._id),
    staleTime: 1000 * 60 * 5,
    enabled: !!authUser && !!selectedUser?._id,
  });

  useEffect(() => {
    if (!selectedUser) return;

    const messageHandler = (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        queryClient.setQueryData(
          ["getMessages", selectedUser._id],
          (oldData) => ({
            ...oldData,
            messages: [...(oldData?.messages || []), newMessage],
          })
        );
      }
    };

    const cleanup = subscribeToMessages(messageHandler);
    return () => {
      cleanup?.();
      unsubscribeFromMessages();
    };
  }, [selectedUser, queryClient, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current && data?.messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.messages]);

  if (isPending)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div
        style={{ padding: 16 }}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {data.messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border overflow-hidden">
                {message.senderId === authUser._id ? (
                  authUser.profilePic ? (
                    <img src={authUser.profilePic} alt="profile pic" />
                  ) : (
                    <div
                      className="size-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: authUser.color || "gray" }} // Default gray if no color
                    >
                      {getInitials(authUser.fullName)}
                    </div>
                  )
                ) : selectedUser.profilePic ? (
                  <img src={selectedUser.profilePic} alt="profile pic" />
                ) : (
                  <div
                    className="size-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                    style={{ backgroundColor: selectedUser.color || "gray" }} // Default gray if no color
                  >
                    {getInitials(selectedUser.fullName)}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 4 }} className="chat-header mb-1">
              <time
                style={{ marginLeft: 4 }}
                className="text-xs opacity-50 ml-1"
              >
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              style={{ paddingInline: 16, paddingBlock: 8 }}
              className="chat-bubble flex flex-col"
            >
              {message.image && (
                <img
                  style={{ marginBottom: 8 }}
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
