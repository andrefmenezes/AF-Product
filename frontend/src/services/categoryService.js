import api from './api';

const baseURL = '/Category';

export default {
  name: 'CategoryService',

  async create(data) {    
    return api
      .post(`${baseURL}/`, data)
      .then((response) => response.data)
      
  },
  async edit(data) {    
    return api
      .put(`${baseURL}/edit/${data.updateCategoryData._id}`,data)
      .then((response) => response.data)      
  },
  async delete(id) {    
    return api
      .delete(`${baseURL}/${id}`)
      .then((response) => response.data)
      
  },

  async getAll() {
    return api
      .get(`${baseURL}/`)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error.response);
      });
  },
};
