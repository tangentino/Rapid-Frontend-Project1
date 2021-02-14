import Vue from 'vue';
import firebase from 'firebase/app';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import firebaseConfig from './plugins/firebaseConfig';
import 'firebase/auth';

Vue.config.productionTip = false;

firebase.initializeApp(firebaseConfig);

let app;
firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('setUserProfile', user);
  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
