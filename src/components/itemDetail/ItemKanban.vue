<template>
<v-container fluid>
  <div class="d-flex flex-row justify-start pa-2" style="overflow-x:scroll;display:flex;">
    <!-- kanbans -->
    <draggable tag="div" :list="[...kanbans, defaultKanban]" @change="moveKanban" class="d-flex">
      <v-card class="mx-1" elevation="0" color="#f5f5f5" min-width="300" max-width="300" min-height="600" v-for="(kanban, i) in [...kanbans, defaultKanban]" :key="i">
        <!-- kanban title -->
        <v-container fluid>
          <v-row v-if="kanban.kb_id==0" class="pa-5">
            <span class="text-subtitle-2">默认分组</span>
            <v-spacer></v-spacer>
          </v-row>
          <v-row class="pa-4 align-center" v-else>
            <span class="text-subtitle-2">{{ kanban.kb_name }}</span>
            <v-spacer></v-spacer>
            <!-- kanban edit menu -->
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind:activator="attrs" v-on="on" fab x-small text>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn @click="kanbanToEdit = kanban" text block small>
                    <v-icon class="mr-2" small>mdi-pencil-outline</v-icon>编辑看板
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="removeKanban({kb_id: kanban.kb_id})" text block small>
                    <v-icon class="mr-2" small>mdi-delete-outline</v-icon>删除看板
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
          <v-divider></v-divider>
          <!-- kanban edit form -->
          <KanbanFormCard @save="editKanban" @cancel="kanbanToEdit=null" v-bind:newKanban="kanbanToEdit" v-if="kanbanToEdit && kanbanToEdit.kb_id==kanban.kb_id" />
          <v-row class="pa-1">
            <!-- create task form -->
            <TaskFormCard @save="saveTask(kanban)" v-bind:newTask="newTask" v-if="newTask && newTask.task_kanban == kanban.kb_id" />
            <!-- create task button -->
            <v-btn v-else @click="formatNewTask(kanban)" class="mt-6 ml-3" text color="blue" small>+创建任务</v-btn>
          </v-row>
          <!-- task card -->
          <v-row>
            <draggable tag="v-container" group="task-group" :list="kanban.kb_tasks" :animation="200" @change="changeDnd(kanban)" @end="endDnd" class="pa-1">
              <v-row class="ma-1" v-for="(task, i) in kanban.kb_tasks" :key="i">
                <TaskCard  @pick="selectTask" :task="task" />
              </v-row>
            </draggable>
          </v-row>
        </v-container>
      </v-card>
    </draggable>
    <div class="d-flex pa-1">
      <!-- create kanban button -->
      <v-btn class="ma-16" @click="formatNewKanban" v-if="!newKanban" text color="blue" x-large>+创建新看板</v-btn>
      <!-- create kanban form -->
      <KanbanFormCard @save="saveKanban" @cancel="newKanban=null" v-bind:newKanban="newKanban" v-else />
    </div>
  </div>
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';

import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import Draggable from 'vuedraggable';
export default {
  name: 'ItemKanban',
  components: {
    UserPicker: () => import('@/components/common/UserPicker.vue'),
    DateRangePicker,
    TaskCard: () => import('@/components/itemDetail/shared/TaskCard.vue'),
    Draggable,
    KanbanFormCard: () => import('@/components/itemDetail/shared/KanbanFormCard.vue'),
    TaskFormCard: () => import('@/components/itemDetail/shared/TaskFormCard.vue'),
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('kanban', ['kanbans', 'defaultKanban']),
    ...mapGetters('task', ['tasks'])
  },
  data: () => ({
    newKanban: null,
    newTask: null,
    kanbanToEdit: null,
    changed: []
  }),
  methods: {
    ...mapActions('kanban', ['getKanbans', 'addKanban', 'updateKanban', 'removeKanban', 'updateKanbanDnd']),
    ...mapActions('task', ['getTasks', 'addTaskForMilestone', 'updateTask']),
    formatNewKanban() {
      this.newKanban = {
        kb_name: '',
        kb_parent_item: this.$route.query.id
      }
    },
    formatNewTask(kanban) {
      this.newTask = {
        task_name: '',
        task_owner: this.authUser.id,
        task_start_date: this.getCurrentCycle().start,
        task_end_date: this.getCurrentCycle().end,
        task_kanban: kanban.kb_id,
        task_priority: 3,
        task_parent_item: this.$route.query.id
      }
    },
    saveKanban() {
      this.addKanban(this.newKanban)
      this.newKanban = null
    },
    editKanban() {
      this.updateKanban({
        kb_id: this.kanbanToEdit.kb_id,
        kb_name: this.kanbanToEdit.kb_name
      })
      this.kanbanToEdit = null
    },
    saveTask(kanban) {
      if (this.newTask.task_kanban == 0) {
        delete this.newTask.task_kanban
        this.addTaskForMilestone(this.newTask).then(task => {
          this.newTask = null
          this.getKanbans({
            kb_parent_item: this.$route.query.id
          })
        })
      } else {
        delete this.newTask.task_kanban
        this.addTaskForMilestone(this.newTask).then(task => {
          this.newTask = null
          let kbTask = kanban.kb_task.split(',')
          kbTask.push(task.task_id)
          this.updateKanban({
            kb_id: kanban.kb_id,
            kb_task: kbTask.join(),
            kb_parent_item: this.$route.query.id
          })
        })
      }
    },
    changeDnd(kanban) {
      if (kanban.kb_id != 0) {
        this.changed.push(kanban)
      }
    },
    endDnd(e) {
      this.changed.map(kanban => {
        let kbTask = []
        kanban.kb_tasks.map(task => {
          kbTask.push(task.task_id)
        })
        this.updateKanbanDnd({
          kb_id: kanban.kb_id,
          kb_task: kbTask.join()
        }).then(() => {
          this.getKanbans({
            kb_parent_item: this.$route.query.id
          })
        })
      })
      this.changed = []
    },
    moveKanban(e) {
      if (e.moved.element.kb_id != 0) {
        this.updateKanbanDnd({
          kb_id: e.moved.element.kb_id,
          kb_order: e.moved.newIndex + 1
        }).then(() => {
          this.getKanbans({
            kb_parent_item: this.$route.query.id
          })
        })
      } else {
        this.getKanbans({
          kb_parent_item: this.$route.query.id
        })
      }
    },
    selectTask(e) {
      this.$emit('selectTask', e)
    }
  },
  mounted() {
    this.getKanbans({
      kb_parent_item: this.$route.query.id
    })
  }
}
</script>
