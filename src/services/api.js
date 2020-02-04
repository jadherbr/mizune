import axios from 'axios';
import { getToken } from "./auth";

let url_api = 'http://127.0.0.1:3333';//process.env.REACT_APP_API_URL;
if (process.env.NODE_ENV === 'production') {
  url_api = 'http://studiotaurus.com.br:3333'  
}

export const baseURLAPI = url_api;

const api = axios.create({ baseURL: baseURLAPI });

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;