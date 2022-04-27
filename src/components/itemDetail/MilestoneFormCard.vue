<template>
<v-card elevation="0" color="#FAFAFA" class="mt-16 pa-2" width="300" height="100">
  <v-container fluid>
    <v-row>
      <v-text-field autofocus @keydown.enter="saveMilestone" v-model="newMilestone.ms_name" flat solo placeholder="请输入里程碑名称" dense></v-text-field>
    </v-row>
    <v-row class="ma-0 align-center">
      <v-icon>mdi-account-outline</v-icon>
      <v-menu offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn v-bind="attrs" v-on="on" text small>{{ newMilestone.ms_owner | username }}</v-btn>
        </template>
        <UserPicker @pick="changeMilestoneOwner" />
      </v-menu>
      <date-range-picker ref="picker" opens="left" control-container-class="text-caption align-center d-flex" :locale-data="{ 
                            firstDay: 1,
                            format: 'yyyy-mm-dd',
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: newMilestone.ms_start_date, endDate: newMilestone.ms_end_date}" :ranges="false" @update="changeMilestoneDate">
        <template v-slot:input="picker">
          <div style="cursor: pointer;"></span>
            <v-icon>mdi-calendar-month-outline</v-icon><span>时间</span>
          </div>
        </template>
      </date-range-picker>
      <v-btn class="mx-1" elevation="0" @click="cancel" x-small>取消</v-btn>
      <v-btn :disabled="!newMilestone.ms_name" class="mx-1" elevation="0" @click="saveMilestone" x-small color="grey">保存</v-btn>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
export default {
  name: 'MilestoneFormCard',
  components: {
    UserPicker: () => import('@/components/common/UserPicker.vue'),
    DateRangePicker,
  },
  props: ['newMilestone'],
  data: () => ({
    minDate: '2018-01-01',
    maxDate: '2050-12-31',
  }),
  methods: {
    changeMilestoneOwner(e) {
      this.newMilestone.ms_owner = e.user.id
    },
    changeMilestoneDate(param) {
      let start = param.startDate;
      let end = param.endDate;
      this.newMilestone.ms_start_date = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      this.newMilestone.ms_end_date = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
    },
    saveMilestone() {
      this.$emit('save')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
