<template>
  <v-card outlined elevation="3" width="500" class="mx-auto">
    <v-card-title class="justify-center"> LOGIN AND REGISTER </v-card-title>
    <v-card-subtitle class="text-center">
      Placeholder registration for now: just enter desired email/password and click register
    </v-card-subtitle>
    <v-card-text>
      <v-form>
        <v-text-field
          label="Email address"
          v-model="email"
          outlined
        />
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
          outlined
          class="mb-n5"
        />
      </v-form>
      <span class="error--text">
        {{errorMessage}}
      </span>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="userLogin"
        class="mx-auto"
        color="success"
        rounded
        x-large
        width="200"
      >Login</v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        @click="userRegister"
        class="mx-auto"
        color="success"
        text
      >Register</v-btn>
    </v-card-actions>
  </v-card>
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
    async userRegister() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
    // async goToRegister() {
    //   await this.$router.push({ name: 'Register' });
    // },
  },
};

</script>

<style scoped>

</style>
