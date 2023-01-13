import api from './api';

const baseURL = '/Users';

export default {
  name: 'UserService',

  async create(data) {
    const body = {
      tagCode: data.tagCode,
      truckPlate: data.truckPlate,
      transporter:data.transporter
    };
    return api
      .post(`${baseURL}/`, data)
      .then((response) => response.data)
      
  },
  
};
