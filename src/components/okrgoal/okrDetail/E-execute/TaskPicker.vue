<template>
<v-dialog v-model="dialog" width="350">
  <v-card height="450">
    <v-container class="pt-4" fluid>
      <v-row style="height:400px;">
        <v-treeview :items="myTasks">
          <template v-slot:prepend="{ item, open }">
            <v-btn v-if="item.task_name" @click="select(item)" plain small>
              <v-icon class="mx-1" small>{{ taskStatus[item.task_status-1] }}</v-icon>{{ item.task_name }}
            </v-btn>
          </template>
        </v-treeview>
      </v-row>
      <v-divider></v-divider>
      <v-row class="justify-end mt-4 mx-3">
        <v-btn @click="cancel" class="mx-1" small>取消</v-btn>
        <v-btn @click="assignTask" class="mx-1" color="primary" small>确定</v-btn>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'TaskPicker',
  computed: {
    ...mapGetters("auth", ["authUser"]),
    ...mapGetters("task", ["tasks"]),
    myTasks: function () {
      return [{
          name: "我负责的",
          children: this.tasks.filter(task => task.task_owner == this.authUser.id && task.task_parent_object != this.parent.task_parent_object)
        },
        {
          name: "我参与的",
          children: this.tasks.filter(task => {
            const collaborators = task.task_collaborator.split(",")
            if (collaborators.includes(this.authUser.id.toString()) && task.task_parent_object != this.parent.task_parent_object) {
              return task
            }
          })
        }
      ]
    }
  },
  data() {
    return {
      dialog: false,
      parent: null,
      taskStatus: [
        'mdi-check',
        'mdi-timer-sand-empty',
        'mdi-close',
        'mdi-clock-outline',
        'mdi-pause',
        'mdi-checkbox-blank-outline',
      ],
      selectedTask: null
    }
  },
  methods: {
    ...mapActions("task", ["getTasks", "updateTaskDetail"]),
    open(parent) {
      this.dialog = true
      this.parent = parent
      this.getTasks({
        task_owner: this.authUser.id,
        task_collaborator: this.authUser.id
      })
    },
    select(task) {
      this.selectedTask = task
    },
    cancel() {
      this.dialog = false
    },
    assignTask() {
      const payload = {
        task_id: this.selectedTask.task_id,
        ...this.parent
      }
      this.updateTaskDetail(payload)
      this.dialog = false
    }
  },

}
</script>
