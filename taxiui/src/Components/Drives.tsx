import React, { useEffect, useState } from "react";
import { DriveDto } from "../Metadata/DataTransferObjects";
import { toast } from "react-hot-toast";
import Navigation from "./Layout/Nav";

interface DrivesProps {
  fetchDrives: (role: string, userId: number) => Promise<DriveDto[]>;
}

const Drives: React.FC<DrivesProps> = ({ fetchDrives }) => {
  const [drives, setDrives] = useState<DriveDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const user = JSON.parse(atob(token.split(".")[1]));
      try {
        const drives = await fetchDrives(user.role, user.id);
        setDrives(drives);
      } catch {
        setError("Failed to load drives.");
        toast.error("Failed to load drives.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDrives]);

  if (loading) return <div className="text-pink-800">Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <Navigation />
      <div className="bg-pink-200 border-pink-600 border-4 p-6 rounded-md shadow-lg">
        <h1 className="text-pink-800 text-2xl font-bold mb-4">Drives</h1>
        <table className="w-full border-collapse border border-pink-300">
          <thead className="bg-pink-100">
            <tr>
              <th className="border border-pink-400 p-2 text-pink-800">
                Start Address
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                End Address
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Price
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Waiting Time
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Travel Time
              </th>
              <th className="border border-pink-400 p-2 text-pink-800">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-pink-100/70">
            {drives.map((drive) => (
              <tr key={drive.id}>
                <td className="border border-pink-400 p-2">
                  {drive.startAddress}
                </td>
                <td className="border border-pink-400 p-2">
                  {drive.endAddress}
                </td>
                <td className="border border-pink-400 p-2">{drive.price}</td>
                <td className="border border-pink-400 p-2">
                  {drive.waitingTime}
                </td>
                <td className="border border-pink-400 p-2">
                  {drive.travelTime ?? "/"}
                </td>
                <td className="border border-pink-400 p-2">
                  {drive.driveStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drives;
