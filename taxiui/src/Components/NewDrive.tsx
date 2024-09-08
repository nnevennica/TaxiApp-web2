import React, { useState } from "react";
import { AddDriveDto } from "../Metadata/DataTransferObjects";
import { toast } from "react-hot-toast";
import Navigation from "./Layout/Nav";

interface CreateDriveProps {
  addDrive: (drive: AddDriveDto) => Promise<void>;
}

const CreateDrive: React.FC<CreateDriveProps> = ({ addDrive }) => {
  const [startAddress, setStartAddress] = useState<string>("");
  const [endAddress, setEndAddress] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [waitingTime, setWaitingTime] = useState<number | null>(null);
  const [confirmEnabled, setConfirmEnabled] = useState<boolean>(false);

  const handlePredict = () => {
    if (!startAddress || !endAddress) return;

    // Predict price and waiting time
    const randomTime = Math.floor(Math.random() * 16) + 15; // Random time between 15 and 30 seconds
    const predictedPrice = randomTime * 89;

    setPrice(predictedPrice);
    setWaitingTime(randomTime);
    setConfirmEnabled(true);
  };

  const handleConfirm = async () => {
    if (!startAddress || !endAddress || price === null || waitingTime === null)
      return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const userId = JSON.parse(atob(token.split(".")[1]))?.id;

    try {
      await addDrive({
        userId,
        startAddress,
        endAddress,
        wait: waitingTime,
        price,
      });
      toast.success("Drive created successfully!");
      window.location.href = "/drive";
    } catch {
      toast.error("Failed to create drive.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <Navigation />
      <div className="bg-pink-200 border-pink-600 border-4 p-6 rounded-md shadow-lg">
        <h1 className="text-pink-800 text-2xl font-bold mb-4">
          Create New Drive
        </h1>
        <div className="mb-4">
          <label className="block text-pink-800 font-bold mb-2">
            Start Address
          </label>
          <input
            type="text"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
            className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-pink-800 font-bold mb-2">
            End Address
          </label>
          <input
            type="text"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
            className="w-full p-2 text-pink-800 bg-pink-300 border-2 focus:ring focus:ring-pink-400 focus:outline-none border-pink-500 rounded-md"
          />
        </div>
        <button
          onClick={handlePredict}
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          Predict
        </button>
        {confirmEnabled && (
          <div className="mt-4">
            <p className="text-pink-800">Predicted Price: {price} RSD</p>
            <p className="text-pink-800">
              Predicted Waiting Time: {waitingTime} seconds
            </p>
            <button
              onClick={handleConfirm}
              className="bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDrive;
