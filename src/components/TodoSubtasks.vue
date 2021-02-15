<template>
  <v-expand-transition>
    <div v-show="showSubtasks">
      <v-list color="grey lighten-3">
        <v-text-field
          v-model="subtaskText"
          label="Add subtasks"
          class="mx-10"
          dense
          single-line
          prepend-inner-icon="mdi-clipboard-edit"
          @keyup.enter="createSubtask"
        ></v-text-field>
        <div v-for="(subtask,subtaskID) in subtasks" :key="subtaskID" class="mx-3">
          <v-list-item>
            <v-checkbox
              v-model="subtask.isDone"
              @click="toggleComplete(mainTaskID,subtaskID)">
            </v-checkbox>
            <v-list-item-content>
              <v-list-item-title
                v-if="editing !== subtaskID"
                class="ml-2"
                :style="subtask.isDone ? 'text-decoration:line-through' : '' "
                @dblclick="startEditing(subtask.text,subtaskID)">
                {{ subtask.text }}
              </v-list-item-title>
              <v-text-field
                v-else
                v-model="editingText"
                @keyup.enter="finishEditing(subtaskRef,subtaskID)"
                @keyup.esc="cancelEditing"
                @blur="finishEditing(subtaskRef,subtaskID)"
                dense
                filled
                autofocus
              />
            </v-list-item-content>
            <v-btn icon @click="deleteTodo(subtaskRef,subtaskID)" color="error">
              <v-icon>mdi-cancel</v-icon>
            </v-btn>
          </v-list-item>
          <v-divider/>
        </div>
      </v-list>
    </div>
  </v-expand-transition>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TodoSubtasks',
  data() {
    return { subtaskText: '', editingText: '', editing: null };
  },
  props: [
    'subtasks', 'showSubtasks', 'mainTaskID',
    'toggleComplete', 'deleteTodo',
  ],
  methods: {
    createSubtask() {
      if (this.subtaskText) {
        this.subtaskRef.push({ text: this.subtaskText.trim(), isDone: false });
        this.userRef.child(this.mainTaskID).update({ isDone: false });
      }
      this.subtaskText = '';
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
  },
  computed: {
    ...mapGetters({
      userRef: 'getTodosRef',
    }),
    subtaskRef() {
      return this.userRef.child(this.mainTaskID).child('subtasks');
    },
  },
};
</script>

<style scoped>
.ml-2 {
  cursor: pointer;
}
</style>
