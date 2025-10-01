/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  phoneNumber: string;
  referalId: string;
  status: string;
  loanEligibility: boolean;
  applicationId?: string;
  drivingLicense: string;
  createdAt: string;
}

// Full member profile type to match your API response
export interface MemberProfile {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  drivingLicense: string;
  active: boolean;
  phoneNumber: string;
  status: string;
  referalId: string;
  loanEligibility: boolean;
  createdAt: string;
  membership?: any;
  updatedAt: string;
  __v: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  drivingLicense: string;
  phoneNumber: string;
  referralFullName: string;
  referralEmail: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
