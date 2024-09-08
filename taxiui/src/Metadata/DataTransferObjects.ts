export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: Date;
  address: string;
  role: string;
  oauth: boolean;
  profileImage: string;
}

export interface UserIdDto {
  id: number;
  role: string;
}

export interface UserDto extends RegisterDto {
  id: number;
  blocked: boolean;
  accountStatus: string;
  userRatings: number;
}

export interface AddDriveDto {
  userId: number;
  startAddress: string;
  endAddress: string;
  wait: number;
  price: number;
}

export interface DriveDto {
  id: number;
  userId: number;
  driverId?: number | null;
  startAddress: string;
  endAddress: string;
  price: number;
  waitingTime: number;
  travelTime?: number | null;
  driveStatus: string;
}

export interface DriveState {
  drive: number;
  userId: number;
  driverId: number;
  waitingTime: number;
  travelTime?: number | null;
  started: boolean;
}
