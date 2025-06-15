import api from './api';
import { LoginRequest, RegisterRequest, JwtResponse, User } from '../types/auth';

export const authService = {
  login: async (loginData: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/api/auth/login', loginData);
    return response.data;
  },

  register: async (registerData: RegisterRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/api/auth/register', registerData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/user/me');
    return response.data;
  },

  getUserProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/user/profile');
    return response.data;
  },
};