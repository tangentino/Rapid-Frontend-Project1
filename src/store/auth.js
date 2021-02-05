export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    setUserAuth(context, user) {
      context.commit('setUser', user);
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user != null;
    },
  },
};
