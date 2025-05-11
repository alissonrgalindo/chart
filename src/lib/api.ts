
import axios from "axios";

const ensureHttps = (url: string): string => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL: ensureHttps(apiBaseUrl),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  campaigns: '/campaigns',
  overview: '/overview',
};