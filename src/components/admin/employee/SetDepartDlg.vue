<template>
<v-dialog v-model="dialog" persistent width="650">
  <v-card>
    <v-toolbar height="35" dark color="primary">
      <v-container class="d-flex justify-start align-center">
        修改部门
        <v-spacer></v-spacer>
        <v-icon @click="close" small>mdi-close</v-icon>
      </v-container>
    </v-toolbar>
    <v-container>
      部门
      <v-menu max-width="400"  offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color="grey darken-1" class="px-0" height="40" width="628" outlined>
            <v-container>
              <v-row>
                <v-col v-if="selectedDepart" class="pl-0" cols="3">
                  <v-chip color="blue lighten-2" label @click:close="selectedDepart=null" close outlined>{{selectedDepart.departmentOaName}}</v-chip>
                </v-col>
                <v-col v-else cols="1" class="text--disabled">
                  请选择
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="1" class="text--secondary">
                  <v-icon>mdi-menu-down</v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-btn>
        </template>
        <DepartmentPicker @pick="pickDepartment" />
      </v-menu>
    </v-container>
    <v-container class="pt-0 d-flex justify-end">
      <v-spacer></v-spacer>
      <v-btn class="mx-3" @click="close">取消</v-btn>
      <v-btn class="mx-3 mr-5" color="primary" @click="onOk">确认</v-btn>
    </v-container>

  </v-card>
</v-dialog>
</template>

<script>
import {
  mapActions
} from 'vuex'
export default {
  name: 'SetDepartDlg',
  components: {
    DepartmentPicker: () => import("@/components/common/DepartmentPicker.vue"),
  },
  data() {
    return {
      dialog: false,
      selectedDepart: null,
      users: null
    }
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    open(users) {
      this.dialog = true
      this.users = users
    },
    close() {
      this.dialog = false
    },
    onOk() {
      let ids=[]
      this.users.map(user => {
        ids.push(user.id)
      })
      this.updateUser({
        ids: ids.join(),
        deptId: this.selectedDepart.id
      })      
      this.dialog = false
    },
    pickDepartment(e) {
      this.selectedDepart = e.data
    }
  }
}
</script>
