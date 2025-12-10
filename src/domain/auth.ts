import type { User } from "./user";

export interface AuthLoginResponse {
  access_token: string;
  id?: string | number;
  user_id?: string | number;
  name?: string;
  username?: string;
  email: string;
  role?: string;
}

export interface AuthProfile extends User {}
