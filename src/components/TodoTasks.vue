<template>
  <div>
    <v-container>
      <v-row justify="space-around">
        <v-col cols="8">
          <v-toolbar elevation="5" dark>
            <v-toolbar-title> Your tasks </v-toolbar-title>
            <v-spacer/>
            <v-btn
              small
              text
              color="error"
              @click="deleteCompletedTodos()">
              Remove completed tasks
            </v-btn>
          </v-toolbar>
          <v-list elevation="5">
            <div v-for="(task,taskID) in modifiedTodos" :key="taskID">
              <v-list-item>
                <v-checkbox
                  v-model="task.isDone"
                  @click="toggleComplete(userRef,taskID)">
                </v-checkbox>
                <v-list-item-content>
                  <v-list-item-title
                    v-if="editing !== taskID"
                    class="ml-2"
                    :style="task.isDone ? 'text-decoration:line-through' : '' "
                    @dblclick="startEditing(task.text,taskID)">
                    {{ task.text }}
                  </v-list-item-title>
                  <v-text-field
                    v-else
                    v-model="editingText"
                    @keyup.enter="finishEditing(userRef,taskID)"
                    @keyup.esc="cancelEditing"
                    @blur="finishEditing(userRef,taskID)"
                    dense
                    filled
                    autofocus
                  />
                  <v-list-item-subtitle>
                    <v-dialog
                      :close-on-content-click="false"
                      width="300">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small text
                            :color="task.isDone ? 'success':'error' "
                            v-bind="attrs"
                            v-on="on">
                            {{ todoDateMessage(task) }}
                          </v-btn>
                        </template>
                        <v-date-picker
                          v-model="task.date"
                          @input="setDateVar(task.date);setTodoDate(taskID)"
                        ></v-date-picker>
                    </v-dialog>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-btn icon @click="deleteTodo(userRef,taskID)" color="error">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
                <v-btn icon @click="toggleSubtasks(taskID)">
                  <v-icon large>
                    {{ task.showSubtasks ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
              </v-list-item>
              <v-divider/>
              <TodoSubtasks
                :subtasks="task.subtasks"
                :showSubtasks="task.showSubtasks"
                :mainTaskID="taskID"
                :toggleComplete="toggleComplete"
                :deleteTodo="deleteTodo"
              />
              <v-divider/>
            </div>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TodoSubtasks from '@/components/TodoSubtasks.vue';

export default {
  name: 'TodoTasks',
  components: {
    TodoSubtasks,
  },
  data() {
    return {
      date: null,
      editing: null,
      editingText: '',
    };
  },
  methods: {
    deleteTodo(ref, taskID) {
      ref.child(taskID).remove();
    },
    deleteCompletedTodos() {
      this.userRef.once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();
          if (task.isDone) {
            this.deleteTodo(this.userRef, childSnapshot.key);
          }
        });
      });
    },
    toggleComplete(ref, taskID) {
      ref.child(taskID).transaction((todo) => {
        if (todo) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
    },
    todoDateMessage(task) {
      if (task.isDone) {
        return 'Task completed';
      }

      if (task.date) {
        return `Complete by: ${task.date}`;
      }

      return 'Set date for task';
    },
    setDateVar(date) {
      this.date = date;
    },
    setTodoDate(taskID) {
      this.userRef.update({
        [`${taskID}/date`]: this.date,
      });
    },
    startEditing(text, taskID) {
      this.editing = taskID;
      this.editingText = text;
    },
    cancelEditing() {
      this.editing = null;
      this.editingText = '';
    },
    finishEditing(ref, taskID) {
      ref.update({
        [`${taskID}/text`]: this.editingText,
      });
      this.cancelEditing();
    },
    toggleSubtasks(taskID) {
      this.userRef.child(taskID).transaction((todo) => {
        if (todo) {
          todo.showSubtasks = !todo.showSubtasks;
        }
        return todo;
      });
    },
  },
  computed: {
    ...mapGetters({
      userRef: 'getTodosRef',
      todos: 'getTodos',
    }),
    modifiedTodos() {
      const ans = {};
      const keys = Object.keys(this.todos).sort((a, b) => {
        if (this.todos[a].date === this.todos[b].date) {
          return 0;
        }
        return this.todos[a].date < this.todos[b].date ? -1 : 1;
      });
      keys.forEach((key) => {
        ans[key] = this.todos[key];
      });
      return ans;
    },
    totalTodos() {
      return Object.keys(this.todos).length;
    },
  },
};
</script>

<style scoped>
.ml-2 {
  cursor: pointer;
}
</style>
