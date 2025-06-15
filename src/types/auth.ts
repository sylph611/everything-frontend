export interface User {
  id: number;
  email: string;
  name: string;
  provider?: string;
  providerId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface JwtResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}