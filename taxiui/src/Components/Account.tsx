import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserDto } from "../Metadata/DataTransferObjects";
import Navigation from "./Layout/Nav";

interface UpdateProfileProps {
  updateUser: (data: UserDto) => Promise<void>;
  fetchUserData: () => Promise<UserDto>;
}

const Account: React.FC<UpdateProfileProps> = ({
  updateUser,
  fetchUserData,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<UserDto | null>(null);
  const [oauth, setOauth] = useState<boolean>(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
        setFormData({ ...userData, password: "" });
        setOauth(userData.oauth);
      } catch {
        toast.error("Failed to fetch user data.");
      }
    };

    loadUserData();
  }, [fetchUserData]);
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.toString() || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      try {
        const dataUrl = await fileToBase64(files[0]);
        setFormData((prevData) =>
          prevData ? { ...prevData, [name]: dataUrl } : prevData
        );
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    } else {
      setFormData((prevData) =>
        prevData ? { ...prevData, [name]: value } : prevData
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const updatedData: UserDto = {
        ...formData,
        password: formData.password ? formData.password : "keep",
        profileImage:
          formData.profileImage === user?.profileImage
            ? "keep"
            : formData.profileImage,
      };

      await updateUser(updatedData);
      toast.success("Profile updated successfully!");
      window.location.reload();
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <div
        className="bg-pink-200 border-pink-600 border-4 p-8 rounded-md shadow-lg"
        style={{ fontFamily: "monospace" }}
      >
          <Navigation />
          
        <h2 className="text-pink-800 text-2xl font-bold mb-6 text-center">
          Update Profile
        </h2>
        {user && (
          <>
            <div className="flex flex-col items-center mb-4">
              <img
                src={user.profileImage || "vite.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-pink-500"
              />
              <p className="text-pink-800 text-lg font-bold mt-2">
                {user.email}
              </p>
              <p className="text-pink-600 mt-1">{user.accountStatus}</p>
              <p className="text-pink-600 mt-1">
                {user.blocked ? "Blocked" : "Active"}
              </p>
              <p className="text-pink-600 mt-1">{user.userRatings} Ratings</p>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
              <div className="mb-2 col-span-2">
                <label className="block text-pink-800 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData?.fullName || ""}
                  onChange={handleChange}
                  className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                />
              </div>

              <div className="mb-2">
                <label className="block text-pink-800 text-sm font-bold mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData?.dateOfBirth
                      ? new Date(formData.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                />
              </div>

              <div className="mb-2">
                <label className="block text-pink-800 text-sm font-bold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData?.address || ""}
                  onChange={handleChange}
                  className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                />
              </div>

              {!oauth && (
                <>
                  <div className="mb-2">
                    <label className="block text-pink-800 text-sm font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData?.username || ""}
                      onChange={handleChange}
                      className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-pink-800 text-sm font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData?.email || ""}
                      onChange={handleChange}
                      className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                    />
                  </div>
                </>
              )}

              <div className="mb-2">
                <label className="block text-pink-800 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData?.password || ""}
                  onChange={handleChange}
                  className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                />
              </div>

              <div className="mb-2">
                <label className="block text-pink-800 text-sm font-bold mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
                />
              </div>

              <div className=" col-span-2 flex justify-center mt-4 gap-2">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full flex-1"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex-1"
                >
                  Cancel Update Profile
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
