import apiClient from "./api";
import type { Item, ApiResponse } from "@/types";

export const itemService = {
  // Get all items with optional filters
  async getAll(params?: {
    category?: string;
    active?: boolean;
  }): Promise<Item[]> {
    const response = await apiClient.get<ApiResponse<Item[]>>("/api/v1/items", {
      params,
    });
    return response.data.data!;
  },

  // Get single item by ID
  async getById(id: number): Promise<Item> {
    const response = await apiClient.get<ApiResponse<Item>>(
      `/api/v1/items/${id}`,
    );
    return response.data.data!;
  },

  // Create new item
  async create(itemData: Partial<Item>): Promise<Item> {
    const response = await apiClient.post<ApiResponse<Item>>(
      "/api/v1/items",
      itemData,
    );
    return response.data.data!;
  },

  // Update existing item
  async update(id: number, itemData: Partial<Item>): Promise<Item> {
    const response = await apiClient.put<ApiResponse<Item>>(
      `/api/v1/items/${id}`,
      itemData,
    );
    return response.data.data!;
  },

  // Delete item
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/items/${id}`);
  },
};
