import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Truck } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-cyan-500 text-white flex-col justify-center items-center p-12">

        <div className="bg-white/20 p-6 rounded-full mb-6">
          <Truck size={70} />
        </div>

        <h1 className="text-5xl font-bold mb-4">
          TransitOps
        </h1>

        <p className="text-xl text-center max-w-md leading-8">
          Smart Transport Operations Platform for managing vehicles,
          drivers, trips, maintenance and operational analytics.
        </p>

      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">

        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10">

          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-8">
            Login to your TransitOps account
          </p>

          {/* Email */}
          <div className="mb-5">

            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>

          {/* Password */}
          <div className="mb-3">

            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

          </div>

          <div className="flex justify-between items-center mb-6">

            <label className="flex items-center gap-2 text-sm">

              <input type="checkbox" />

              Remember Me

            </label>

            <button className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </button>

          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

          <div className="mt-8 text-center text-gray-500 text-sm">
            © 2026 TransitOps ERP
          </div>

        </div>

      </div>

    </div>
  );
}
