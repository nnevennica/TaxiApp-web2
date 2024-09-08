import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navigation from "./Layout/Nav";

interface RateDriverProps {
  rateDriver: (driverId: number, rating: number) => Promise<void>;
}

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "pink" : "none"}
    viewBox="0 0 26 26"
    stroke="currentColor"
    className="w-6 h-6 inline-block text-pink-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.164 6.63a1 1 0 00.95.69h6.964c.97 0 1.371 1.24.588 1.81l-5.637 4.07a1 1 0 00-.364 1.118l2.164 6.63c.3.921-.755 1.688-1.54 1.118l-5.637-4.07a1 1 0 00-1.175 0l-5.637 4.07c-.785.57-1.84-.197-1.54-1.118l2.164-6.63a1 1 0 00-.364-1.118L2.347 12.057c-.783-.57-.383-1.81.588-1.81h6.964a1 1 0 00.95-.69l2.164-6.63z"
    />
  </svg>
);

const RateDriverForm: React.FC<RateDriverProps> = ({ rateDriver }) => {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState<number>(0);

  const handleRating = async (rate: number) => {
    setRating(rate);
  };

  const submitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    try {
      await rateDriver(Number(id), rating);
      toast.success("Thank you for your feedback!");
      window.location.href = "/";
    } catch {
      toast.error("Failed to submit rating.");
    }
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <Navigation />
      <center>
        <div className="bg-pink-200 border-pink-600 border-4 p-6 rounded-md shadow-lg max-w-md">
          <h1 className="text-pink-800 text-2xl font-bold mb-4">Rate Driver</h1>
          <div className="flex justify-center items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="mx-1"
              >
                <Star filled={star <= rating} />
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={submitRating}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Submit
            </button>
            <button
              onClick={goToHome}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      </center>
    </div>
  );
};

export default RateDriverForm;
