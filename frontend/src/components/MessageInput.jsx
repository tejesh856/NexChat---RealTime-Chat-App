import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { sendMessage } from "../services/message";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { convertToBase64 } from "../lib/utils";
import { Image, Send, X, Smile } from "lucide-react";

export default function MessageInput() {
  const { selectedUser } = useChatStore();
  const queryClient = useQueryClient();
  const { isPending, mutate: sendMessageTrigger } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      if (selectedUser?._id) {
        queryClient.setQueryData(["getMessages", selectedUser._id], (oldData) => {
          const existingMessages = oldData?.messages || [];
          if (existingMessages.some((message) => message._id === data.message._id)) return oldData;
          return {
            ...(oldData || { success: true }),
            messages: [...existingMessages, data.message],
          };
        });
      }
      toast.success("Message Sent successful! 🎉");
      console.log("send message successful:", data);
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      toast.error(error);
      console.error("send message failed:", error);
    },
  });
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
    "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
    "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜",
    "🤪", "😌", "😔", "😑", "😐", "😶", "🤫", "😏",
    "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤",
    "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🤬",
    "🤡", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟",
    "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦",
    "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖",
    "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡",
    "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡",
    "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸",
    "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🤲",
    "👐", "🙌", "👏", "🙏", "👍", "👎", "👊", "✊",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
    "🎉", "🎊", "🎈", "🎁", "⭐", "✨", "🌟", "💫",
  ];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const base64 = await convertToBase64(file);
    setImagePreview(base64);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const trimmedText = text.trim();
    if (!trimmedText && !imagePreview) return;
    const body = { text: trimmedText, image: imagePreview };
    sendMessageTrigger({ id: selectedUser._id, data: body });
  };
  return (
    <div style={{ padding: 16 }} className="p-4 w-full">
      {imagePreview && (
        <div
          style={{ marginBottom: 12 }}
          className="mb-3 flex items-center gap-2"
        >
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            style={{ paddingInline: 8 }}
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="button"
          className="btn btn-circle text-zinc-400 hover:text-base-content"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile size={20} />
        </button>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {showEmojiPicker && (
        <div className="modal modal-open">
          <div className="modal-box w-96 max-w-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Select Emoji</h3>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="btn btn-ghost btn-lg text-3xl hover:bg-base-300 flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="modal-action">
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="btn btn-sm"
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setShowEmojiPicker(false)}>
            <button>Close</button>
          </form>
        </div>
      )}
    </div>
  );
}
