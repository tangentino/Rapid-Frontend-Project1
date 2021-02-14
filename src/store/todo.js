// import firebase from 'firebase/app';
// import 'firebase/database';
// import 'firebase/auth';

import firebase from 'firebase';

export default {
  state: {
    todos: [],
    ref: null,
  },
  mutations: {
    setTodos(state, todos) {
      state.todos = todos;
    },
    setRef(state, ref) {
      state.ref = ref;
    },
  },
  actions: {
    setTodosAction(context, todos) {
      context.commit('setTodos', todos);
    },
    setTodosRef(context, user) {
      if (user) {
        const todoRef = firebase.database()
          .ref(`users/${user.uid}/todos`);
        todoRef.on('value', (snapshot) => {
          context.dispatch('setTodosAction', snapshot.val());
        });
        context.commit('setRef', todoRef);
      }
    },
  },
  getters: {
    getTodos(state) {
      return state.todos;
    },
    getTodosRef(state) {
      return state.ref;
    },
  },
};
