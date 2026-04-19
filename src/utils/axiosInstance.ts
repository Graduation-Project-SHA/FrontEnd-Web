import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '../config';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type TokenPair = {
  access_token?: string;
  refresh_token?: string;
};

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const onRefreshComplete = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const clearSessionAndRedirect = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

const extractTokens = (payload: unknown): TokenPair => {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const direct = payload as TokenPair & { data?: unknown };

  if (direct.data && typeof direct.data === 'object') {
    const wrapped = direct.data as TokenPair;
    return {
      access_token: wrapped.access_token,
      refresh_token: wrapped.refresh_token,
    };
  }

  return {
    access_token: direct.access_token,
    refresh_token: direct.refresh_token,
  };
};

axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const statusCode = error.response?.status;
    const requestUrl = originalRequest.url ?? '';

    if (statusCode !== 401) {
      return Promise.reject(error);
    }

    if (requestUrl.includes('/auth/refresh-token')) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${config.apiBaseUrl}/auth/refresh-token`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const { access_token, refresh_token } = extractTokens(refreshResponse.data);

      if (!access_token || !refresh_token) {
        throw new Error('Invalid refresh token payload');
      }

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      onRefreshComplete(access_token);

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      onRefreshComplete(null);
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
