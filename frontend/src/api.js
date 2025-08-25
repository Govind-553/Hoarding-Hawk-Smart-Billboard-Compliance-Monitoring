import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API;

export const submitReport = (reportData, token) => {
  const formData = new FormData();
  for (const key in reportData) {
    formData.append(key, reportData[key]);
  }
  return axios.post(`${API_URL}/reports`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getReports = (token) => {
  return axios.get(`${API_URL}/reports`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getAnalytics = (token) => {
  return axios.get(`${API_URL}/analytics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const updateReportStatus = (reportId, status, token) => {
  return axios.patch(`${API_URL}/reports/${reportId}`, { status }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};