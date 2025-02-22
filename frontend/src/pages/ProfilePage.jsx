import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { UpdateProfile } from "../services/user";
import toast from "react-hot-toast";
import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { convertToBase64, getInitials } from "../lib/utils";

export default function ProfilePage() {
  const { authUser, setAuthUser } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const { isPending, mutate: updateProfileTrigger } = useMutation({
    mutationFn: UpdateProfile,
    onError: (error) => {
      toast.error(error);
      console.log("Error:", error);
    },
    onSuccess: (data) => {
      toast.success("Profile Updated successful! 🎉");
      console.log("Success:", data);
      setAuthUser(data.user);
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const base64 = await convertToBase64(file);
    setSelectedImg(base64);
    updateProfileTrigger({ profilePic: base64 });
  };

  return (
    <div
      style={{ paddingTop: 20 }}
      className="flex-1 flex items-center justify-center pt-20"
    >
      <div
        style={{
          padding: 16,
          paddingBlock: 32,
          marginInline: "auto",
        }}
        className="max-w-2xl w-full mx-auto p-4 py-8"
      >
        <div
          style={{ padding: 24 }}
          className="bg-base-300 rounded-xl p-6 flex flex-col gap-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p style={{ marginTop: 8 }} className="mt-2">
              Your profile information
            </p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {authUser.profilePic ? (
                <img
                  src={selectedImg || authUser.profilePic}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
              ) : (
                <div
                  className="size-32 rounded-full border-4 border-primary flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: authUser.color || "transparent" }} // Default gray if color is not provided
                >
                  {getInitials(authUser.fullName)}
                </div>
              )}
              <label
                style={{ padding: 8 }}
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isPending ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isPending}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isPending
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p
                style={{ paddingInline: 16, paddingBlock: 10 }}
                className="px-4 py-2.5 bg-base-200 rounded-lg border"
              >
                {authUser?.fullName}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p
                style={{ paddingInline: 16, paddingBlock: 10 }}
                className="px-4 py-2.5 bg-base-200 rounded-lg border"
              >
                {authUser?.email}
              </p>
            </div>
          </div>

          <div
            style={{ marginTop: 24, padding: 24 }}
            className="mt-6 bg-base-300 rounded-xl p-6"
          >
            <h2
              style={{ marginBottom: 16 }}
              className="text-lg font-medium  mb-4"
            >
              Account Information
            </h2>
            <div className=" flex flex-col gap-6 text-sm">
              <div
                style={{ paddingBlock: 8 }}
                className="flex items-center justify-between py-2 border-b border-zinc-700"
              >
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div
                style={{ paddingBlock: 8 }}
                className="flex items-center justify-between py-2"
              >
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
