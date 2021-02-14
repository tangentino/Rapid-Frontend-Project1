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
    setUserProfile(context, user) {
      context.commit('setUser', user);
      context.dispatch('setTodosRef', user, { root: true });
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
};
