<template>
<h1>LOGIN PAGE</h1>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: '',
    errorMessage: '',
  }),
  methods: {
    async userLogin() {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);

        if (response) {
          await this.$store.dispatch('auth/setUserAuth', response.user);
          await this.$router.push({ name: 'Home' });
        }
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
  },
};

</script>

<style scoped>

</style>
