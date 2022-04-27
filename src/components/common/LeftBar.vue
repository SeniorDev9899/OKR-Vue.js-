<template>
  <v-navigation-drawer
    :permanent="true"
    :mini-variant="!drawer"
    app
    floating
    width="190"
    color="slateBlue"
    dark
  >
    <v-container>
      <v-col>
        <v-row>
          <v-spacer></v-spacer>
          <v-icon @click="setDrawer" small>mdi-menu</v-icon>
          <v-spacer v-if="!drawer"></v-spacer>
        </v-row>
      </v-col>
    </v-container>
    <v-divider></v-divider>
    <LeftBarMenu :item="item" v-for="(item, i) in items" :key="i" />
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { Routes } from "@/constants/routes";
import { constant } from '@/constants/constant.js'
export default {
  name: "LeftBar",
  components: {
    LeftBarMenu: () => import("@/components/common/LeftBarMenu"),
  },
  computed: {
    ...mapGetters("app", ["drawer"]),
  },
  data() {
    return {
      items: [
        {
          title: "动态",
          icon: "mdi-message-reply-text",
          link: "/",
        },
        {
          title: "OKRs-E",
          icon: "mdi-target",
          children: [
            { name: "OKR 目标", link: `${Routes.OKR_LIST_PAGE}/${constant.pageCount}/1` , pageName: 'okrListPage'},
            { name: "OKR 地图", link: Routes.OKR_MAP_PAGE, pageName: 'okrMapPage' },
            { name: "OKR 执行", link: Routes.OKR_WORKING_METHOD_HOME, pageName: 'workingMethodMain' },
            { name: "OKR 仪表盘", link: Routes.OKR_DASHBOARD_PAGE, pageName: 'okrDashboardPage' },
            { name: "OKR 案例库", link: Routes.OKR_IMPORT_LIBRARY, pageName: 'okrLibraryPage' },
          ],
        },
        {
          title: "任务协同",

          icon: "mdi-note-plus-outline",
          children: [
            { name: "任务计划", link: Routes.EXE_SCHEDULE_PAGE, pageName: 'ScheduleMain' },
            { name: "任务协同", link: Routes.EXE_PROJECT_PAGE, pageName: 'projectPage' },
            { name: "任务总结", link: Routes.EXE_SUMMARY_PAGE, pageName: 'summaryPage' },
          ],
        },
        {
          title: "文件",
          icon: "mdi-folder",
          link: "/",
        },
        {
          title: "通讯录",
          icon: "mdi-notebook",
          link: "/",
        },
        {
          title: "工作报表",
          icon: "mdi-chart-bar",
          link: "/",
        },

      ],
      right: null,
    };
  },
  methods: {
    ...mapActions("app", ["setDrawer"]),
  },
};
</script>
<style></style>
