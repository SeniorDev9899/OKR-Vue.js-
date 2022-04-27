<template>
<v-container fluid>
  <Gantt :tasks="taskList" />
</v-container>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'GanttChart',
  components: {
    Gantt: () => import('@/components/itemDetail/Gantt.vue')
  },
  computed: {
    ...mapGetters('task', ['tasks']),
    taskList: function () {
      let temp = this.tasks
      temp.map(task => {
        const start = new Date(task.task_start_date)
        const end = new Date(task.task_end_date)
        task.duration = Math.round(end - start)
        task.type = 'project'
        task.start = task.task_start_date
      })
      return temp;
    }
  },
  data() {
    return {
      dynamicStyles: {},
    }
  },
  methods: {
    ...mapActions('task', ['getTasks']),
  },
  mounted() {
    this.getTasks({
      task_parent_item: this.$route.query.id
    })
  }
}
</script>
