<template>
<v-card style="cursor:pointer;" width="300" height="80" elevation="0">
  <v-container fluid>
    <v-row class="pa-3 align-center d-flex">
    <!-- task_status-->
      <v-menu offset-y :nudge-width="50">
        <template v-slot:activator="{attrs, on}">
          <v-icon v-bind="attrs" v-on="on" x-small>{{ taskStatus[task.task_status-1].icon }}</v-icon>
        </template>
        <v-card class="pa-1">
          <v-btn @click="changeStatus(status)" small text block v-for="status in [1,2,3,4,5,6]" :key="status">
            <v-icon class="mx-1" x-small>{{ taskStatus[status-1].icon }}</v-icon><span>{{ taskStatus[status-1].text }}</span>
          </v-btn>
        </v-card>
      </v-menu>
      <!-- task name -->
      <span @click="selectTask" class="text-subtitle-1 mx-2">{{ task.task_name }}</span>    
      <v-spacer></v-spacer>
      <v-avatar size="30" color="orange">{{ task.task_owner | surename }}</v-avatar>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row class="pa-2 align-center">
    <!-- task priority -->
      <v-icon :color="priority[task.task_priority-1].color">mdi-numeric-{{ task.task_priority }}-circle-outline</v-icon>
      <!-- task subtask status -->
      <span class="text-caption mx-4">{{ task.task_subtask_status }}</span>
      <v-spacer></v-spacer>
      <!-- task date range -->
      <span class="text-caption mx-2">{{ getDate(task.task_end_date) }}</span>
      <span :class="`${getRestDays(task.task_end_date).color}--text text-caption mx-2`">{{ getRestDays(task.task_end_date).text }}</span>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TaskCard',
  props: ['task'],
  data: () => ({
    priority: [{
        text: '最高',
        color: 'red'
      },
      {
        text: '高',
        color: 'yellow'
      },
      {
        text: '中',
        color: 'blue'
      },
      {
        text: '低',
        color: 'green'
      },
      {
        text: '非常低',
        color: 'gray'
      },
    ],
    taskStatus: [{
        icon: 'mdi-check',
        text: '已完成',
        value: 1
      },
      {
        icon: 'mdi-timer-sand-empty',
        text: '进行中',
        value: 2
      },
      {
        icon: 'mdi-close',
        text: '已取消',
        value: 3
      },
      {
        icon: 'mdi-clock-outline',
        text: '已延迟',
        value: 4
      },
      {
        icon: 'mdi-pause',
        text: '暂停中',
        value: 5
      },
      {
        icon: 'mdi-checkbox-blank-outline',
        text: '未开始',
        value: 6
      }
    ],
  }),
  methods: {
    ...mapActions('task', ['updateTaskForMilestone']),
    getDate(date) {
      let temp = new Date(date)
      return (temp.getMonth() + 1) + '/' + (temp.getDate())
    },
    getRestDays(endDate) {
      let temp;
      const today = new Date();
      const endDay = new Date(endDate);
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((endDay-today)/oneDay);
      if(diffDays >= 0) {
        temp = {text: `剩余${diffDays}天`, color: "blue"}
      } else {
        temp = {text: `过期${-diffDays}天`, color: "red"}
      }
      return temp
    },
    changeStatus(value) {
      const payload = {
        task_id: this.task.task_id,
        task_status: value,
        task_parent_item: this.task.task_parent_item,
      }
      this.updateTaskForMilestone(payload)
    },
    selectTask() {
      this.$emit('pick', this.task.task_id)
    }
  }
}
</script>
