import React, { useEffect, useState } from "react";
import { DriveDto } from "../Metadata/DataTransferObjects";
import { toast } from "react-hot-toast";
import Navigation from "./Layout/Nav";

interface NewDrivesProps {
  fetchNewDrives: () => Promise<DriveDto[]>;
  acceptDrive: (driveDto: DriveDto) => Promise<void>;
}

const NewDrives: React.FC<NewDrivesProps> = ({
  fetchNewDrives,
  acceptDrive,
}) => {
  const [drives, setDrives] = useState<DriveDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDrives = await fetchNewDrives();
        setDrives(fetchedDrives);
      } catch {
        setError("Failed to load new drives.");
        toast.error("Failed to load new drives.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intid = setInterval(fetchData, 2000);
    return () => clearInterval(intid);
  }, [fetchNewDrives]);

  const handleAccept = async (driveDto: DriveDto) => {
    try {
      await acceptDrive(driveDto);
      toast.success("Drive accepted successfully.");
      window.location.href = "/drive";
    } catch {
      toast.error("Failed to accept drive.");
    }
  };

  if (loading) return <div className="text-pink-800">Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <Navigation />
      <div className="bg-pink-200 border-pink-600 border-4 p-6 rounded-md shadow-lg">
        <h1 className="text-pink-800 text-2xl font-bold mb-4">New Drives</h1>
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
              <th className="border border-pink-400 p-2 text-pink-800">
                Actions
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
                <td className="border border-pink-400 p-2">
                  <button
                    onClick={() => handleAccept(drive)}
                    className="bg-green-700 hover:bg-green-700/80 text-white font-bold py-1 px-2 rounded"
                  >
                    Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewDrives;
