export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OAuthProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider: "google" | "facebook";
  avatar?: string;
}
