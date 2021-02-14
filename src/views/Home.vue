<template>
  <div>
    <v-container>
      <v-row justify="space-around">
        <v-col cols="8">
          <v-text-field
            label="What needs to be done?"
            v-model="todoText"
            solo
            prepend-inner-icon="mdi-notebook-edit"
            class="mt-10"
            @keyup.enter="createTodo"
          />
        </v-col>
      </v-row>
    </v-container>
    <TodoTasks/>
    <v-btn
      @click="userLogout"
      class="mt-10"
      color="error"
    >Logout</v-btn>
  </div>
</template>

<script>

import firebase from 'firebase';
import TodoTasks from '@/components/TodoTasks.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    TodoTasks,
  },
  data() {
    return { todoText: '' };
  },
  methods: {
    createTodo() {
      if (this.todoText) {
        this.userRef.push({
          text: this.todoText.trim(), isDone: false, date: null, showSubtasks: false, subtasks: [],
        });
      }
      this.todoText = '';
    },
    async userLogout() {
      try {
        await firebase
          .auth()
          .signOut();
        await this.$router.replace({ name: 'Login' });
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
  },
  computed: {
    ...mapGetters({
      userRef: 'getTodosRef',
    }),
  },
};
</script>
