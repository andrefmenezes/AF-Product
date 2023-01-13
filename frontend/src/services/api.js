import Axios from 'axios';
import store from '../store';

const options = {
  baseURL: 'http://localhost:5235/',
};

const api = Axios.create(options);

api.interceptors.request.use((config) => {
  if (localStorage.access_token) {
    config.headers = {
      Authorization: `${localStorage.access_token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch('destroyToken');
    }
    return Promise.reject(error);
  }
);

export default api;
