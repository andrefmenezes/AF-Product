import Vue from 'vue';
import Vuex from 'vuex';
import authService from './services/auth';
import router from './router';
Vue.use(Vuex);
import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  state: {
    barColor: 'rgb(70,70,70), rgb(70,70,70)',
    drawer: null,
    token: localStorage.getItem('access_token') || null,
    filter: 'all',
    kpiDataPresenceList: [],
  },
  mutations: {
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload;
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },
    receiveJsonData(state, kpiDataPresenceList) {
      state.kpiDataPresenceList = kpiDataPresenceList;
    },
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
      localStorage.removeItem('access_token');
    },
  },
  actions: {
    destroyToken(context) {
      if (context.getters.loggedIn) {
        localStorage.removeItem('access_token');
        context.commit('destroyToken');
      }
    },
    async login(context, credentials) {
      try {
        
      } catch (error) {
        
      }
      const signinData = {
        username: credentials.username,
        password: credentials.password,
      };
      await authService.login(signinData).then((response) => {
        const token = response.session._id;
        localStorage.setItem('access_token', token);
        context.commit('retrieveToken', token);
        router.push('/dashboard');
      }).catch(e =>{
        alert(e.response.data.message)
      });
    },
  },
  getters: {
    loggedIn(state) {
      return state.token !== null;
    },
    token(state) {
      return state.token;
    },
    data(state) {
      return state.kpiDataPresenceList;
    },
  },
  // plugins: [vuexLocal.plugin]
});
