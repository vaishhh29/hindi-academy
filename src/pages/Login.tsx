import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --------------------
  // Form Field Change
  // --------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --------------------
  // Validation
  // --------------------
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --------------------
  // Submit
  // --------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log("Logged In:", formData);

      setIsLoggedIn(true);
      setFormData({ email: "", password: "" });

      // Redirect after 1 second
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    }
  };

  // --------------------
  // SUCCESS SCREEN
  // --------------------
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-xl text-center">

          <p>Redirecting to Admin Panel...</p>
        </div>
      </div>
    );
  }

  // --------------------
  // MAIN UI
  // --------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Mail className="w-4 h-4 mr-2 text-green-500" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl border-gray-300
                         focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">⚠ {errors.email}</p>
            )}
          </div>

          {/* PASSWORD WITH EYE ICON */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Lock className="w-4 h-4 mr-2 text-green-500" />
              Password *
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-xl border-gray-300 
                           focus:border-green-500 focus:ring-2 focus:ring-green-500
                           pr-12"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">⚠ {errors.password}</p>
            )}
          </div>

          {/* BUTTON CENTERED */}
          <div className="w-full flex justify-center pt-2">
            <button
              type="submit"
              className="relative overflow-hidden w-auto group bg-gradient-to-r 
                         from-orange-500 via-amber-500 to-green-500 
                         text-white px-7 py-3 rounded-full font-semibold 
                         shadow-md hover:shadow-lg transition-all duration-300 
                         transform hover:scale-105 hover:-translate-y-0.5 
                         motion-safe:animate-pulse"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Login
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>

              <div
                className="absolute inset-0 bg-gradient-to-r 
                           from-green-500 via-amber-500 to-orange-500 
                           opacity-0 group-hover:opacity-100 
                           transition-opacity duration-500"
              ></div>
            </button>
          </div>

          {/* SIGNUP LINK */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-green-600 font-semibold hover:underline">
                Create one
              </a>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
