import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { LoginDto, RegisterDto } from "../../Metadata/DataTransferObjects";
import { Link } from "react-router-dom";

interface LoginFormProps {
  loginService: (data: LoginDto) => Promise<string | null>;
  registerService: (data: RegisterDto) => Promise<string | null>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginService,
  registerService,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginData: LoginDto = { email, password };
    const token = await loginService(loginData);
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in successfully!");
      window.location.reload();
    } else {
      toast.error("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    const state = localStorage.getItem("token");
    if (state) window.location.href = "/account";
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userData = await response.json();
        const registerData: RegisterDto = {
          username: userData.email.split("@")[0],
          email: userData.email,
          password: "111",
          fullName: userData.name,
          dateOfBirth: new Date(),
          address: "Not Provided",
          role: "User",
          oauth: true,
          profileImage: userData.picture,
        };
        const token = await registerService(registerData);
        if (token) {
          localStorage.setItem("token", token);
          toast.success("Logged in with Google successfully!");
          window.location.reload();
        } else {
          toast.error("Failed to register with Google. Please try again.");
        }
      } catch {
        toast.error("An error occurred while logging in with Google.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <form
        onSubmit={handleLoginSubmit}
        className="bg-pink-200 border-pink-600 border-4 p-8 rounded-md shadow-lg "
        style={{ fontFamily: "monospace" }}
      >
        <h2 className="text-pink-800 text-2xl font-bold mb-4 text-center">
          Login
        </h2>
        <div className="mb-4">
          <label className="block text-pink-800 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-pink-800 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
            required
          />
        </div>
        <div className="flex items-center space-x-4 justify-between mb-4">
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full w-1/2"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-1/2"
          >
            Google Login
          </button>
        </div>
        <div className="text-center">
          <Link to="/register" className="text-pink-800">
            Don't have an account? Register here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
