<template>
<v-container fluid>
  <div class="d-flex flex-row justify-start" style="overflow-x:scroll;">
    <!-- milestones -->
    <div class="milestone px-0 py-2" v-for="(milestone, i) in [...milestones, defaultMilestone]" :key="i">
      <!-- milestone title -->
      <v-container fluid>
        <v-row v-if="milestone.ms_id == 0">
          <div :class="`${milestones.length>0 ? 'defaultmilestone-title1':'defaultmilestone-title'} align-center d-flex`">
            <span class="ml-5 text-subtitle-1">默认分组</span>
          </div>
          <div class="defaultmilestone-title-triangle"></div>
        </v-row>
        <v-row v-else>
          <div :class="`${getClass(milestone, i)[0]} align-center d-flex`">
            <v-avatar class="ml-3" size="30" color="light-green">{{ milestone.ms_owner | surename }}</v-avatar>
            <span class="ml-5 text-subtitle-1">{{ milestone.ms_name }}</span>
            <v-spacer></v-spacer>
            <v-chip small color="white"><span :class="`${getRestDays(milestone.ms_end_date).color}--text text-caption mx-2`">{{ getRestDays(milestone.ms_end_date).text }}</span></v-chip>
          </div>
          <div :class="getClass(milestone, i)[1]"></div>
        </v-row>
        <v-row class="px-4 py-2">
          <v-card class="pa-0" elevation="0" color="#F5F5F5" width="300" min-height="600" max-height="1000">
            <!-- create newtask form -->
            <v-container>
              <v-row class="pa-1">
                <!-- create task form -->
                <TaskFormCard @save="saveTask(milestone)" v-bind:newTask="newTask" v-if="newTask && newTask.task_milestone == milestone.ms_id" />
                <!-- create task button -->
                <v-btn v-else @click="formatNewTask(milestone)" class="mt-6 ml-3" text color="blue" small>+创建任务</v-btn>
              </v-row>
              <!-- task cards -->
              <v-row>
                <draggable tag="v-container" group="task-group" :list="milestone.ms_tasks" @change="changeDnd(milestone)" @end="endDnd" ghost-class="ghost-card" :animaion="200" class="pa-1">
                  <v-row class="ma-1" v-for="(task, i) in milestone.ms_tasks" :key="i">
                    <TaskCard @pick="selectTask" :task="task" />
                  </v-row>
                </draggable>
              </v-row>
            </v-container>
          </v-card>
        </v-row>
      </v-container>
    </div>
    <!-- create new milestone form-->
    <div class="milestone">
      <v-btn class="ma-16" @click="formatNewMilestone" v-if="!newMilestone" text color="blue" x-large>+创建里程碑</v-btn>
      <MilestoneFormCard @cancel="newMilestone=null" @save="saveMilestone" v-bind:newMilestone="newMilestone" v-else />
    </div>
  </div>
  <!-- right task editor -->
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';
import Draggable from 'vuedraggable';
export default {
  name: 'ItemMilestone',
  components: {
    UserPicker: () => import('@/components/common/UserPicker.vue'),
    TaskCard: () => import('@/components/itemDetail/shared/TaskCard.vue'),
    Draggable,
    TaskFormCard: () => import('@/components/itemDetail/shared/TaskFormCard.vue'),
    MilestoneFormCard: () => import('@/components/itemDetail/MilestoneFormCard.vue'),
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('milestone', ['milestones', 'defaultMilestone']),
    ...mapGetters('task', ['tasks'])
  },
  data: () => ({
    newMilestone: null,
    newTask: null,
    changed: []
  }),
  methods: {
    ...mapActions('milestone', ['getMilestones', 'addMilestone', 'updateMilestone', 'updateMilestoneDnd']),
    ...mapActions('task', ['getTasks', 'addTaskForMilestone', 'updateTask']),
    formatNewMilestone() {
      this.newMilestone = {
        ms_name: '',
        ms_owner: this.authUser.id,
        ms_start_date: this.getCurrentCycle().start,
        ms_end_date: this.getCurrentCycle().end,
        ms_parent_item: this.$route.query.id
      }
    },
    formatNewTask(milestone) {
      if (milestone.ms_id == 0) {
        this.formatDefaultTask()
      } else {
        this.newTask = {
          task_name: '',
          task_owner: this.authUser.id,
          task_start_date: milestone.ms_start_date,
          task_end_date: milestone.ms_end_date,
          task_milestone: milestone.ms_id,
          task_priority: 3,
          task_parent_item: this.$route.query.id
        }
      }
    },
    formatDefaultTask() {
      this.newTask = {
        task_name: '',
        task_owner: this.authUser.id,
        task_start_date: this.getCurrentCycle().start,
        task_end_date: this.getCurrentCycle().end,
        task_milestone: 0,
        task_priority: 3,
        task_parent_item: this.$route.query.id
      }
    },
    saveMilestone() {
      this.addMilestone(this.newMilestone)
      this.newMilestone = null
    },
    saveTask(milestone) {
      if (this.newTask.task_milestone == 0) {
        delete this.newTask.task_milestone
        this.addTaskForMilestone(this.newTask).then(task => {
          this.newTask = null
          this.getMilestones({
            ms_parent_item: this.$route.query.id
          })
        })
      } else {
        delete this.newTask.task_milestone
        this.addTaskForMilestone(this.newTask).then(task => {
          this.newTask = null
          let msTasks = milestone.ms_task.split(',')
          msTasks.push(task.task_id)
          this.updateMilestone({
            ms_id: milestone.ms_id,
            ms_task: msTasks.join(),
            ms_parent_item: this.$route.query.id
          })
        })
      }
    },
    getClass(milestone, index) {
      let classTemp = ''
      if (index == 0) {
        const today = new Date()
        const endDay = new Date(milestone.ms_end_date)
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round((endDay - today) / oneDay);
        if (diffDays >= 0) {
          classTemp = ['milestone-title-first-current', 'milestone-triangle-current']
        } else {
          classTemp = ['milestone-title-first-past', 'milestone-triangle-past']
        }
      } else {
        const today = new Date()
        const endDay = new Date(milestone.ms_end_date)
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round((endDay - today) / oneDay);
        if (diffDays >= 0) {
          classTemp = ['milestone-title-current', 'milestone-triangle-current']
        } else {
          classTemp = ['milestone-title-past', 'milestone-triangle-past']
        }
      }
      return classTemp
    },
    getRestDays(endDate) {
      let temp;
      const today = new Date();
      const endDay = new Date(endDate);
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((endDay - today) / oneDay);
      if (diffDays >= 0) {
        temp = {
          text: `剩余${diffDays}天`,
          color: "blue"
        }
      } else {
        temp = {
          text: `过期${-diffDays}天`,
          color: "red"
        }
      }
      return temp
    },
    changeDnd(milestone) {
      if(milestone.ms_id != 0) {
        this.changed.push(milestone)
      }      
    },
    endDnd(e) {
      this.changed.map(milestone => {
        let msTask = []
        milestone.ms_tasks.map(task => {
          msTask.push(task.task_id)
        })
        this.updateMilestoneDnd({
          ms_id: milestone.ms_id,
          ms_task: msTask.join()
        }).then(() => {
          this.getMilestones({
            ms_parent_item: this.$route.query.id
          })
        })
      })
      this.changed = []
    },
    selectTask(e) {
      this.$emit('selectTask', e)
    }
  },
  mounted() {
    this.getMilestones({
      ms_parent_item: this.$route.query.id
    })
  }
}
</script>

<style lang="css">
.milestone-container {
  height: 1000px;
  background-color: red;
}

.milestone {
  width: 350px;
}

.milestone-title-first-current {
  background-color: orange;
  height: 50px;
  width: 316px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  color: white;
}

.milestone-title-first-past {
  background-color: red;
  height: 50px;
  width: 316px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  color: white;
}

.milestone-title-current {
  background-color: orange;
  height: 50px;
  width: 316px;
  border-left: 16px solid white;
  border-top: 25px solid transparent;
  border-bottom: 25px solid transparent;
  color: white;
}

.milestone-title-past {
  background-color: red;
  height: 50px;
  width: 316px;
  border-left: 16px solid white;
  border-top: 25px solid transparent;
  border-bottom: 25px solid transparent;
  color: white;
}

.milestone-triangle-current {
  border-top: 25px solid transparent;
  border-left: 16px solid orange;
  border-bottom: 25px solid transparent;
}

.milestone-triangle-past {
  border-top: 25px solid transparent;
  border-left: 16px solid red;
  border-bottom: 25px solid transparent;
}

.defaultmilestone-title1 {
  background-color: #BDBDBD;
  height: 50px;
  width: 316px;
  border-left: 16px solid white;
  border-top: 25px solid transparent;
  border-bottom: 25px solid transparent;
  color: white;
}

.defaultmilestone-title {
  background-color: #BDBDBD;
  height: 50px;
  width: 316px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
}

.defaultmilestone-title-triangle {
  border-top: 25px solid transparent;
  border-left: 16px solid #BDBDBD;
  border-bottom: 25px solid transparent;
}

.ghost-card {
  opacity: 0.5;
  background: #F7FAFC;
  border: 1px solid #4299e1;
}
</style>
