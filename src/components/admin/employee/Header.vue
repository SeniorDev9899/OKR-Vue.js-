<template>
<v-toolbar elevation="0"  fluid class="blue lighten-4 d-flex justify-end">
  <!-- <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="mx-1" v-bind="attrs" v-on="on">
        批量导入/导出<v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title>
          <v-btn small plain>批量导入</v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-btn small plain>导出通讯录</v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu> -->
  <!-- <v-btn class="mx-1" small>快速邀请同事</v-btn> -->
  <v-btn :disabled="authUser.user_role!='creator'" class="mx-1" small @click="setBoss">设置公司老板</v-btn>
  <v-btn class="mx-1" small color="primary" @click="addEmployee">新增</v-btn>
  <NewEmployeeDlg ref="newEmployee" />
</v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'GroupHeader',
  components: {
    NewEmployeeDlg: () => import('@/components/admin/employee/NewEmployee.vue')
  },
  props:['department'],
  computed: {
    ...mapGetters("auth", ["authUser"])
  },
  methods: {
    addEmployee() {
      this.$refs.newEmployee.open(this.department)
    },
    setBoss() {
      this.$emit('setBoss')
    },
  }
}
</script>
