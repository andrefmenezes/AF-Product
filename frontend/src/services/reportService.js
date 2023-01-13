import api from './api';

const baseURL = '/Report';

export default {
  name: 'ReportService',

  async generateReport(filter) {
    return api
      .post(`${baseURL}/generateReport`, filter)
      .then((response) => response.data)
      .catch((error) => error);
  },
};