<template>
<v-card>
  <v-container fluid>
    <v-row class="d-flex pt-3 px-2 mb-1 aligin-center">
      <span class="text-caption ml-3">设置反馈提醒</span>
      <v-spacer></v-spacer>
      <v-btn @click="cancel" color="blue" text small>取消提醒</v-btn>
    </v-row>
    <v-row>
      <v-divider></v-divider>
    </v-row>
    <v-row class="mt-10 pa-5 d-flex align-center">
      <VueCronEditorBuefy 
        class="text-caption" 
        :visibleTabs="visibleTabs" 
        v-model="cronValue"
        locale="zh_CN"
        :custom-locales="locals"
      />
    </v-row>
    <v-row class="ma-3 justify-end">
      <v-btn @click="cancel" class="mx-1" small>cancel</v-btn>
      <v-btn @click="set" class="mx-1" small color="primary">ok</v-btn>
    </v-row>
  </v-container>
</v-card>
</template>
<script>
import VueCronEditorBuefy from 'vue-cron-editor-buefy';
import cronstrue from 'cronstrue/i18n';
export default {
  name: 'SetTaskCron',
  components: {
    VueCronEditorBuefy
  },
  computed: {
    cronText: function() {
      return cronstrue.toString(this.cronValue, {use24HourTimeFormat: true, locale: "zh_CN"})
    }
  },
  data: () => ({
    cronValue: "* * */1 * *",
    visibleTabs: [
      "daily",
      "weekly",
      "monthly",
    ],
    locals: {
      zh_CN: {
        every: "每一个",
        mminutes: "分钟",
        hoursOnMinute: "一分钟一小时",
        daysAt: "时间",
        at: "时间",
        onThe: "日子",
        dayOfEvery: "月",
        monthsAt: "时间",
        everyDay: "每周",
        mon: "星期一",
        tue: "星期二",
        wed: "星期三",
        thu: "星期四",
        fri: "星期五",
        sat: "星期六",
        sun: "星期天",
        hasToBeBetween: "",
        and: "和",
        minutes: "分",
        hourly: "每小时",
        daily: "每日",
        weekly: "每周",
        monthly: "每月",
        advanced: "高级",
        cronExpression: "cron 表达式:"
      }
    }
  }),
  methods: {
    cancel() {
      this.$emit('close')
    },
    set() {
      this.$emit('set',{text: this.cronText, value: this.cronValue})
    }
  }
}
</script>
