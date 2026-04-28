import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export interface DashboardStats {
  patients: {
    total: number;
    verified: number;
  };
  doctors: {
    total: number;
    verified: number;
    pending: number;
  };
  appointments: {
    total: number;
    today: number;
    upcoming: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  donations: {
    total: number;
  };
  homeCare: {
    totalBookings: number;
    totalNurses: number;
    verifiedNurses: number;
    pendingNurses: number;
    bookingsByStatus: {
      pending: number;
      confirmed: number;
      active: number;
      completed: number;
      cancelled: number;
    };
  };
  systemHealth: {
    timestamp: string;
  };
}

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/statistics/dashboard');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard statistics:', err);
      setError('تعذر تحميل الإحصاءات. يرجى المحاولة لاحقا.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
};
