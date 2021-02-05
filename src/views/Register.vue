<template>
  <h1>REGISTER PAGE</h1>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Register',
  data: () => ({
    email: '',
    password: '',
    errorMessage: '',
  }),
  methods: {
    async userRegister() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
  },
};
</script>

<style scoped>

</style>
