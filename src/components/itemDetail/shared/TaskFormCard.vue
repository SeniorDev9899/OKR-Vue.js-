<template>
<v-card class="pa-2 d-flex align-center" width="294" height="70" elevation="0">
  <!-- input task name -->
  <v-text-field autofocus @keydown.enter="saveTask" class="mt-6" v-model="newTask.task_name" flat solo placeholder="输入任务名称'回车'保存" dense></v-text-field>
  <!-- task datepicker -->
  <date-range-picker ref="picker" opens="center" control-container-class="text-caption" :locale-data="{ 
                                  firstDay: 1,
                                  format: 'yyyy-mm-dd',
                                  applyLabel: '确定',
                                  cancelLabel: '取消',
                                  daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                                  monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                              }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: newTask.task_start_date, endDate: newTask.task_end_date}" :ranges="false" @update="changeTaskDate">
    <template v-slot:input="picker">
      <div style="cursor: pointer;"></span>
        <v-icon>mdi-calendar-month-outline</v-icon>
      </div>
    </template>
  </date-range-picker>
  <!-- task priority selector -->
  <v-menu offset-y :nudge-width="50">
    <template v-slot:activator="{attrs, on}">
      <v-icon class="ml-n8" :color="priority[newTask.task_priority-1].color" v-bind="attrs" v-on="on">mdi-numeric-{{newTask.task_priority}}-circle-outline</v-icon>
    </template>
    <v-card>
      <v-btn @click="newTask.task_priority=i" :color="priority[i-1].color" class="justify-start" block v-for="i in [1,2,3,4,5]" :key="i" text>
        <v-icon>mdi-numeric-{{ i }}-circle-outline</v-icon>
        <span>{{ priority[i-1].text }}</span>
      </v-btn>
    </v-card>
  </v-menu>
  <!-- task owner -->
  <v-menu offset-y>
    <template v-slot:activator="{attrs, on}">
      <v-btn elevation="0" class="mx-1 text-caption" color="green" fab x-small v-bind="attrs" v-on="on">{{ newTask.task_owner | surename }}</v-btn>
    </template>
    <UserPicker @pick="changeTaskOwner" />
  </v-menu>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
export default {
  name: 'TaskFormCard',
  components:{
    DateRangePicker,
    UserPicker: () => import('@/components/common/UserPicker.vue'),
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  props: ['newTask'],
  data: () => ({
    minDate: '2018-01-01',
    maxDate: '2050-12-31',
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
  }),
  methods: {
    saveTask() {
      this.$emit('save')
    },
    changeTaskDate(param) {
      let start = param.startDate;
      let end = param.endDate;
      this.newTask.task_start_date = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      this.newTask.task_end_date = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
    },
    changeTaskOwner(e) {
      this.newTask.task_owner = e.user.id
    },
  }
}
</script>
