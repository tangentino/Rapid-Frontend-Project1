import 'firebase/auth';
import firebase from 'firebase/app';

export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state) {
      state.user = firebase.auth().currentUser;
    },
  },
  actions: {
    setUserAuth(context) {
      context.commit('setUser');
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
};
