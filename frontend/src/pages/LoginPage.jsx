import React from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-1 grid lg:grid-cols-2 ">
      <LoginForm />
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}
