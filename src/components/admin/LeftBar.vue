<template>
  <v-navigation-drawer
    :permanent="true"
    :mini-variant="!drawer"
    app
    floating
    width="190"
    color="primary"
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
          title: "员工管理",
          icon: "mdi-account",
          children: [
            {
              name: "在职员工",
              link: Routes.ADMIN_EMPLOYEE_PAGE,
              pageName: 'employeePage'
            },
            {
              name: "离职员工",
              link: Routes.ADMIN_RESIGN_PAGE,
              pageName: 'resignPage'
            },
            // {
            //   name: "外部成员管理",
            //   link: Routes.ADMIN_EXTERNAL_PAGE,
            // },
            // {
            //   name: "群组管理",
            //   link: Routes.ADMIN_GROUP_PAGE,
            // },
            // {
            //   name: "职务",
            //   link: Routes.ADMIN_JOB_PAGE,
            // },
            {
              name: "部门管理",
              link: Routes.ADMIN_DEPARTMENT_PAGE,
              pageName: "departmentPage"
            }
          ],
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
