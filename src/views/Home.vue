<template>
  <div class="home">
    <v-btn
      @click="userLogout"
      class="mx-auto"
      color="success"
      text
    >Logout</v-btn>
  </div>
</template>

<script>

import firebase from 'firebase';

export default {
  name: 'Home',
  methods: {
    async userLogout() {
      try {
        await firebase
          .auth()
          .signOut();
        await this.$router.push({ name: 'Login' });
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
  },
};
</script>
