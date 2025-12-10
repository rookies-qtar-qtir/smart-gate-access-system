export interface User {
  id?: number | string;
  user_id?: number | string;
  uid: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  plateNumber?: string[] | string;
}
