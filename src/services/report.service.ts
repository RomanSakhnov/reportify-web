import apiClient from "./api";
import type {
  DashboardData,
  ReportMetrics,
  TrendsData,
  ApiResponse,
} from "@/types";

export const reportService = {
  // Get dashboard data with summary and charts
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      "/api/v1/reports/dashboard",
    );
    return response.data.data!;
  },

  // Get time-series metrics
  async getMetrics(days: number = 30): Promise<ReportMetrics> {
    const response = await apiClient.get<ApiResponse<ReportMetrics>>(
      "/api/v1/reports/metrics",
      { params: { days } },
    );
    return response.data.data!;
  },

  // Get trends analysis
  async getTrends(): Promise<TrendsData> {
    const response = await apiClient.get<ApiResponse<TrendsData>>(
      "/api/v1/reports/trends",
    );
    return response.data.data!;
  },
};
