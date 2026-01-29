import apiClient from "./api";
import type { User, ApiResponse } from "@/types";

export const userService = {
  // Get all users
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>("/api/v1/users");
    return response.data.data!;
  },

  // Get single user by ID
  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      `/api/v1/users/${id}`,
    );
    return response.data.data!;
  },

  // Create new user
  async create(userData: Partial<User> & { password: string }): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      "/api/v1/users",
      userData,
    );
    return response.data.data!;
  },

  // Update existing user
  async update(id: number, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/api/v1/users/${id}`,
      userData,
    );
    return response.data.data!;
  },

  // Delete user
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/users/${id}`);
  },
};
