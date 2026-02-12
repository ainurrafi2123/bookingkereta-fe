// lib/types/dashboard-types.ts

export interface DashboardStats {
  total_trains: number;
  total_carriages: number;
  total_users: number;
  active_schedules: number;
  total_bookings: number;
  total_revenue: number;
  recent_bookings: number;
  booking_status: {
    booked: number;
    cancelled: number;
  };
  growth: {
    bookings: number;
    revenue: number;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}
