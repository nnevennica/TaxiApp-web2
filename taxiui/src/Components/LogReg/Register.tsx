import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RegisterDto } from "../../Metadata/DataTransferObjects";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

interface RegisterFormProps {
  registerService: (data: RegisterDto) => Promise<string | null>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ registerService }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  useEffect(() => {
    const state = localStorage.getItem("token");
    if(state)
        window.location.href = "/account";
  }, [])

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const registerData: RegisterDto = {
      username,
      email,
      password,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      address,
      role,
      oauth: false,
      profileImage: profileImage || "",
    };

    const token = await registerService(registerData);
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Registered successfully!");
      window.location.reload();
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <form
        onSubmit={handleRegisterSubmit}
        className="bg-pink-200 border-pink-600 border-4 p-8 rounded-md shadow-lg"
        style={{ fontFamily: "monospace" }}
      >
        <h2 className="text-pink-800 text-2xl font-bold mb-6 text-center">
          Register
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="mb-2 col-span-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
              required
            />
          </div>

          <div className="mb-2 col-span-2">
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

          <div className="mb-2">
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

          <div className="mb-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
              required
            />
          </div>

          <div className="mb-2 col-span-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
              required
            />
          </div>

          <div className="mb-2 col-span-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
              required
            >
              <option value="User">User</option>
              <option value="Driver">Driver</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="mb-2 col-span-2">
            <label className="block text-pink-800 text-sm font-bold mb-2">
              Profile Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between mt-2 gap-x-4">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full w-1/2"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-1/2"
            >
              Google Login
            </button>
          </div>
        </div>{" "}
        <div className="text-center mt-4 -mb-4">
          <Link to="/" className="text-pink-800">
            Have an account? Login here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
