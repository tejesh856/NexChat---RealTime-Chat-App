import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Login } from "../services/user";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [showPassword, setshowPassword] = useState(false);
  const { setAuthUser } = useAuthStore();

  const { isPending, mutate: createloginTrigger } = useMutation({
    mutationFn: Login,
    onError: (error) => {
      toast.error(error);
      console.log("Error:", error);
      setAuthUser(null);
    },
    onSuccess: (data) => {
      toast.success("Login successful! 🎉");
      console.log("Success:", data);
      setAuthUser(data.user);
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    createloginTrigger(data);
  };

  return (
    <div
      style={{ padding: 24 }}
      className="flex flex-col justify-center items-center p-6 sm:p-12"
    >
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* LOGO */}
        <div style={{ marginBottom: 32 }} className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 style={{ marginTop: 8 }} className="text-2xl font-bold mt-2">
              Welcome Back
            </h1>
            <p className="text-base-content/60">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <div
                  className={`relative ${
                    !errors.email ? "border-primary/20" : "border-error"
                  }`}
                >
                  <div
                    style={{ paddingLeft: 12 }}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    style={{ paddingLeft: 40 }}
                    className={`input ${
                      !errors.email ? "input-bordered" : "input-error"
                    } w-full pl-10`}
                    placeholder="you@example.com"
                    {...field}
                  />
                </div>
              )}
            />
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
                  message:
                    "Must contain a number, a lowercase & an uppercase letter",
                },
              }}
              render={({ field }) => (
                <div
                  className={`relative ${
                    !errors.password ? "border-primary/20" : "border-error"
                  }`}
                >
                  <div
                    style={{ paddingLeft: 12 }}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    style={{ paddingLeft: 40 }}
                    type={showPassword ? "text" : "password"}
                    className={`input ${
                      !errors.password ? "input-bordered" : "input-error"
                    } w-full pl-10`}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    type="button"
                    style={{ paddingRight: 12 }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setshowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              )}
            />
            {errors.password && (
              <p className="text-error text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
