import React from "react";
import SignupForm from "../components/SignupForm";
import AuthImagePattern from "../components/AuthImagePattern";

export default function SignUpPage() {
  return (
    <div className="flex-1 grid lg:grid-cols-2 ">
      <SignupForm />
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}
