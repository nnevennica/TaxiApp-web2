import React, { useEffect, useState } from "react";
import { UserDto } from "../Metadata/DataTransferObjects";
import { toast } from "react-hot-toast";
import Navigation from "./Layout/Nav";

interface VerificationProps {
  fetchDrivers: () => Promise<UserDto[]>;
  verifyDriver: (driverId: number, status: string) => Promise<void>;
  blockDriver: (driverId: number) => Promise<void>;
}

const Verification: React.FC<VerificationProps> = ({
  fetchDrivers,
  verifyDriver,
  blockDriver,
}) => {
  const [drivers, setDrivers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drivers = await fetchDrivers();
        setDrivers(drivers);
      } catch {
        setError("Failed to load drivers.");
        toast.error("Failed to load drivers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDrivers]);

  const handleVerify = async (driverId: number, status: string) => {
    try {
      await verifyDriver(driverId, status);
      toast.success(
        `Driver ${
          status === "Allowed" ? "allowed" : "disallowed"
        } successfully.`
      );
      window.location.reload();
    } catch {
      toast.error("Failed to verify driver.");
    }
  };

  const handleBlockUnblock = async (driverId: number) => {
    try {
      await blockDriver(driverId);
      console.log(drivers)
      toast.success("Driver status updated successfully.");
      window.location.reload();
    } catch {
      toast.error("Failed to update driver status.");
    }
  };

  if (loading) return <div className="text-pink-800">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <Navigation />
      <div className="bg-pink-200 border-pink-600 border-4 p-6 rounded-md shadow-lg">
        <h1 className="text-pink-800 text-2xl font-bold mb-4">
          Driver Verification
        </h1>
        <table className="w-full border-collapse border border-pink-300">
          <thead className="bg-pink-100">
            <tr>
              <th className="border border-pink-400 p-2 text-pink-800">ID</th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Username
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Email
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                User Ratings
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Account Status
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-pink-100/70">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="border border-pink-400 p-2">{driver.id}</td>
                <td className="border border-pink-400 p-2">
                  {driver.username}
                </td>
                <td className="border border-pink-400 p-2">{driver.email}</td>
                <td className="border border-pink-400 p-2">
                  {driver.userRatings}
                </td>
                <td className="border border-pink-400 p-2">
                  {driver.accountStatus}
                </td>
                <td className="border border-pink-400 p-2">
                  {driver.accountStatus === "Non allowed" ? (
                    <>
                      <button
                        onClick={() => handleVerify(driver.id, "Allowed")}
                        className="bg-emerald-600 hover:bg-emerald-600/80 text-white font-bold py-1 px-2 rounded"
                      >
                        Allow
                      </button>
                      <button
                        onClick={() => handleVerify(driver.id, "Disallowed")}
                        className="bg-pink-600 hover:bg-pink-600/80 text-white font-bold py-1 px-2 rounded ml-2"
                      >
                        Disallow
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleBlockUnblock(driver.id)}
                      className={`bg-${
                        driver.blocked
                          ? "emerald-600"
                          : "pink-600"
                      } hover:bg-${
                        driver.blocked
                          ? "emerald-600/80"
                          : "pink-600/80"
                      } text-white font-bold py-1 px-2 rounded`}
                    >
                      {driver.blocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Verification;
