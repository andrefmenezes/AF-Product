import api from './api';

const baseURL = '/Users';

export default {
  name: 'Users',

  async login(signinData) {
    return api
      .post(`${baseURL}/auth`, { signinData: signinData })
      .then((response) => response.data);
      
  },
};
