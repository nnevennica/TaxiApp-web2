import axios from "axios";
import {
  AddDriveDto,
  DriveDto,
  DriveState,
  LoginDto,
  RegisterDto,
  UserDto,
} from "./DataTransferObjects";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_TSF;

export const loginService = async (data: LoginDto): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_URL}auth/login`, data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const registerService = async (
  data: RegisterDto
): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_URL}auth/reg`, data);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    return null;
  }
};

export const fetchUserData = async (): Promise<UserDto> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found.");

  const { id } = jwtDecode<{ id: number }>(token);
  const response = await axios.get<UserDto>(`${API_URL}user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUser = async (data: UserDto): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found.");

  await axios.put(`${API_URL}user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchDrives = async (
  role: string,
  userId: number
): Promise<DriveDto[]> => {
  try {
    const response = await axios.get(`${API_URL}drives`, {
      params: {
        role,
        user: userId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching drives:", error);
    throw new Error("Failed to fetch drives.");
  }
};

export const fetchDrivers = async (): Promise<UserDto[]> => {
  try {
    const response = await axios.get(`${API_URL}drivers`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch drivers.");
  }
};

export const verifyDriver = async (
  driverId: number,
  status: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}driver/verify/${driverId}/${status}`, {
      driver: driverId,
      ver: status,
    });
  } catch {
    throw new Error("Failed to verify driver.");
  }
};

export const blockDriver = async (driverId: number): Promise<void> => {
  try {
    await axios.post(`${API_URL}driver/block/${driverId}`, {
      driver: driverId,
    });
  } catch {
    throw new Error("Failed to block/unblock driver.");
  }
};

export const addDrive = async (drive: AddDriveDto): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}drive`, drive, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to add drive.");
    }
  } catch (error) {
    console.error("Error adding drive:", error);
    throw error;
  }
};

export const fetchNewDrives = async (): Promise<DriveDto[]> => {
  try {
    const response = await axios.get(`${API_URL}drives/new`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching new drives:", error);
    throw error;
  }
};

export const acceptDrive = async (driveDto: DriveDto): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const user = JSON.parse(atob(token.split(".")[1]));

    const updatedDriveDto = {
      ...driveDto,
      driverId: user.id,
    };

    const response = await axios.post(
      `${API_URL}drive/accept`,
      updatedDriveDto,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to accept drive.");
    }
  } catch (error) {
    console.error("Error accepting drive:", error);
    throw error;
  }
};

export const fetchDriveState = async (
  userId: number,
  isDriver: boolean
): Promise<DriveState | null> => {
  try {
    const response = await axios.get(`${API_URL}state/${userId}/${isDriver}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch drive state.");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching drive state:", error);
    return null;
  }
};

export const rateDriver = async (
  driverId: number,
  rating: number
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_URL}driver/rate/${driverId}/${rating}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to rate driver.");
    }
  } catch (error) {
    console.error("Error rating driver:", error);
    throw error;
  }
};
