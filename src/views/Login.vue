<template>
  <v-card outlined elevation="3" width="500" class="mx-auto">
    <v-card-title class="justify-center"> LOGIN AND REGISTER </v-card-title>
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
        elevation="3"
        rounded
        x-large
        width="400"
      >Login</v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        @click="userGoogleLogin"
        class="mx-auto"
        color="info"
        elevation="3"
        rounded
        x-large
        width="400"
      >Sign in with Google</v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        @click="userRegister"
        class="mx-auto"
        color="success"
        text
      >Register
      </v-btn>
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
          await this.$router.replace({ name: 'Home' });
        }
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
    async userGoogleLogin() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const response = await firebase.auth().signInWithPopup(provider);

        if (response) {
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
