import api from './api';

const baseURL = '/Products';

export default {
  name: 'ProductsService',

  async create(data) {
    return api
      .post(`${baseURL}/`, data)
      .then((response) => response.data)

  },
  async edit(data) {
    return api
      .put(`${baseURL}/edit/${data.updateProductData._id}`, data)
      .then((response) => response.data)
  },
  async pay(id) {
    return api
      .put(`${baseURL}/pay/${id}`)
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
  
  async getDash() {
    return api
      .get(`${baseURL}/dashboard`)
      .then((response) => response.data)
     
  },
};
