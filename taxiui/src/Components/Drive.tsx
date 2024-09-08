import React, { useEffect, useState } from "react";
import { DriveState } from "../Metadata/DataTransferObjects";
import { toast } from "react-hot-toast";
import Navigation from "./Layout/Nav";
import { useNavigate } from "react-router-dom";

interface DriveProps {
  fetchDriveState: (
    userId: number,
    isDriver: boolean
  ) => Promise<DriveState | null>;
}

const Drive: React.FC<DriveProps> = ({ fetchDriveState }) => {
  const [driveState, setDriveState] = useState<DriveState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const user = JSON.parse(atob(token.split(".")[1]));
      const isDriver = user.role === "Driver";

      try {
        const state = await fetchDriveState(user.id, isDriver);
        setDriveState(state);
      } catch {
        setError("Failed to load drive state.");
        toast.error("Failed to load drive state.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intid = setInterval(fetchData, 700);
    return () => clearInterval(intid);
  }, [fetchDriveState]);

  useEffect(() => {
    if (
      driveState &&
      driveState.waitingTime === 0 &&
      (driveState.travelTime === null || driveState.travelTime === 0)
    ) {
      const token = localStorage.getItem("token");
      if (!token) return;

      const user = JSON.parse(atob(token.split(".")[1]));
      if (user.role === "User") {
        navigate(`/drive/${driveState.driverId}`);
      } else {
        navigate("/");
      }
    }
  }, [driveState, navigate]);

  if (loading) return <div className="text-pink-800">Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <Navigation />
      <div className="bg-pink-200 border-pink-600 border-4 p-6 rounded-md shadow-lg">
        <h1 className="text-pink-800 text-2xl font-bold mb-4">Drive State</h1>
        {driveState ? (
          <div className="bg-pink-100 border-pink-400 p-4 rounded-md shadow-md">
            <p className="text-pink-800">
              <strong>Waiting Time:</strong> {driveState.waitingTime} seconds
            </p>
            <p className="text-pink-800">
              <strong>Travel Time:</strong>{" "}
              {!driveState.travelTime || driveState.travelTime === -1
                ? "Not Accepted"
                : driveState.travelTime + " seconds"}
            </p>
            <p className="text-pink-800">
              <strong>Started:</strong> {driveState.started ? "Yes" : "No"}
            </p>
          </div>
        ) : (
          <p className="text-pink-800">No drive state available.</p>
        )}
      </div>
    </div>
  );
};

export default Drive;
