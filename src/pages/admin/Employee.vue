<template>
  <v-container fluid class="pa-0 ma-0" id="employee-container">
    <v-row class="pa-0 ma-0" style="width:100%;height:100%;">
      <GroupLeftbar @pickDepart="selectDepart" :departments="departTree"/>
      <v-col class="ma-0 pa-0">
        <GroupHeader :department="currentDepart.id" @setBoss="setBoss"/>
        <!-- main section of page, 頁面的主要部分 -->
        <GroupView ref="userSelector" :department="currentDepart" style="background: white;"/>
      </v-col>
    </v-row>
    <SetBossDlg ref="SetBossDlg"/>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    GroupLeftbar: () => import("@/components/admin/employee/Leftbar.vue"),
    GroupHeader: () => import("@/components/admin/employee/Header.vue"),
    GroupView: () => import("@/components/admin/employee/GroupView.vue"),
    SetBossDlg: () => import("@/components/admin/employee/SetBossDlg.vue")
  },
  computed: {
    ...mapGetters('department', ['departTree', 'departments']),
    ...mapGetters('auth', ['authUser']),
  },
  data() {
    return {
      currentDepart: {}
    }
  },
  mounted() {
    this.getDepartments()
    // const index = this.departments.findIndex(department => department.id = this.authUser.deptId)
    // this.currentDepart = this.departments[index]
  },
  methods: {
    ...mapActions('department', ['getDepartments', 'getAllDepartments']),
    setBoss() {
      this.$refs.SetBossDlg.open()
    },
    selectDepart(e) {
      this.currentDepart = e.data
    }
  }
}
</script>
<style>
#employee-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>