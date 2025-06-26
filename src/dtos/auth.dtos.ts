export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  wilaya: string;
  daira: string;
  baladia: string;
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
