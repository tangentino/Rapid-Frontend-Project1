<template>
  <div>
    <v-container>
      <v-row justify="space-around">
        <v-col>
          <v-toolbar elevation="5" dark>
            <v-toolbar-title> {{ todoMessage() }} </v-toolbar-title>
            <template v-slot:extension>
              <v-tabs>
                <v-tabs-slider color="blue"/>
                <v-tab @click="showAllTodos">All</v-tab>
                <v-tab @click="showActiveTodos">Active</v-tab>
                <v-tab @click="showCompletedTodos">Completed</v-tab>
              </v-tabs>
              <v-btn
                text
                color="error"
                @click="deleteCompletedTodos()">
                Remove completed tasks
              </v-btn>
            </template>
          </v-toolbar>
          <v-list elevation="5">
            <div v-for="(task,taskID) in modifiedTodos" :key="taskID">
              <v-list-item>
                <v-checkbox
                  v-model="task.isDone"
                  @click="toggleComplete(taskID)">
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
              <v-progress-linear
                :value="taskProgress(taskID)"
                color="success"
                height="17"
                striped>
                <template v-slot:default="{ value }">
                  <strong>{{ value }}%</strong>
                </template>
              </v-progress-linear>
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
      showAll: true,
      showActive: false,
      showCompleted: false,
    };
  },
  methods: {
    taskProgress(taskID) {
      const todo = this.todos[taskID];
      if (todo.isDone) {
        return 100;
      }
      if (todo.subtasks) {
        const totalSubtasks = Object.keys(todo.subtasks).length;
        // eslint-disable-next-line max-len
        const completedSubtasks = Object.keys(todo.subtasks).filter((key) => todo.subtasks[key].isDone).length;
        return Math.ceil((completedSubtasks / totalSubtasks) * 100);
      }
      return 0;
    },
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
    toggleComplete(taskID, subtaskID) {
      this.userRef.child(taskID).transaction((todo) => {
        if (todo) {
          if (subtaskID) {
            todo.subtasks[subtaskID].isDone = !todo.subtasks[subtaskID].isDone;
            // eslint-disable-next-line max-len
            const activeSubtasks = Object.keys(todo.subtasks).filter((key) => !todo.subtasks[key].isDone);
            if (activeSubtasks.length === 0) {
              todo.isDone = true;
            } else {
              todo.isDone = false;
            }
          } else {
            todo.isDone = !todo.isDone;
            if (todo.subtasks) {
              Object.keys(todo.subtasks).forEach((key) => {
                todo.subtasks[key].isDone = todo.isDone;
              });
            }
          }
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
    todoMessage() {
      if (this.todos) {
        return `You currently have ${this.totalTodos} total tasks (${this.activeTodos.length} active, ${this.completedTodos.length} completed)`;
      }
      return 'You currently have no tasks';
    },
    showAllTodos() {
      this.showAll = true;
      this.showActive = false;
      this.showCompleted = false;
    },
    showActiveTodos() {
      this.showAll = false;
      this.showActive = true;
      this.showCompleted = false;
    },
    showCompletedTodos() {
      this.showAll = false;
      this.showActive = false;
      this.showCompleted = true;
    },
  },
  computed: {
    ...mapGetters({
      userRef: 'getTodosRef',
      todos: 'getTodos',
    }),
    modifiedTodos() {
      if (this.todos) {
        const keys = this.filteredTodos;
        const ans = {};
        const sorted = keys.sort((a, b) => {
          if (this.todos[a].date === this.todos[b].date) {
            return 0;
          }
          return this.todos[a].date < this.todos[b].date ? -1 : 1;
        });
        sorted.forEach((key) => {
          ans[key] = this.todos[key];
        });
        return ans;
      }
      return this.todos;
    },
    totalTodos() {
      if (this.todos) {
        return Object.keys(this.todos).length;
      }
      return 0;
    },
    completedTodos() {
      if (this.todos) {
        return Object.keys(this.todos).filter((key) => this.todos[key].isDone);
      }
      return this.todos;
    },
    activeTodos() {
      if (this.todos) {
        return Object.keys(this.todos).filter((key) => !this.todos[key].isDone);
      }
      return this.todos;
    },
    filteredTodos() {
      let ans;
      if (this.showActive) {
        ans = this.activeTodos;
      } else if (this.showCompleted) {
        ans = this.completedTodos;
      } else {
        ans = Object.keys(this.todos);
      }
      return ans;
    },
  },
};
</script>

<style scoped>
.ml-2 {
  cursor: pointer;
}
</style>
