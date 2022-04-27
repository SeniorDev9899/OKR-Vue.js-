<template>
<v-dialog  persistent v-model="dialog" max-width="700">
  <v-card>
    <v-toolbar color="white">
      <v-container>
        <v-row>
          <v-col>
            新增部门
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1" class="pl-5">
            <v-icon @click="cancel">mdi-close</v-icon>
          </v-col>
        </v-row>
      </v-container>

    </v-toolbar>
    <v-card-text>
      <v-container fluid>
        <v-row class="text-caption pt-5 pl-3">部门名称</v-row>
        <v-row>
          <v-col class="pt-0">
            <v-text-field v-if="department" height="30" dense v-model="department.departmentOaName" placeholder="请输入" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row class="text-caption pl-3">部门领导</v-row>
        <v-row class="pl-3">        
          <v-menu v-if="department" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" color="grey darken-1" class="px-3" height="40" width="628" outlined>
                <span v-if="department.dp_leader==''">请选择</span>
                <v-chip v-for="(user, i) in leaders" @click:close="removeLeader(user)" :key="i" v-else class="mr-2" outlined close label color="blue">{{ user | username }}</v-chip>
                <!-- <v-chip v-else class="mr-2" outlined close label color="blue">{{ leaders[0] | username }}</v-chip> -->
                <v-spacer></v-spacer>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-card>
              <UserPicker @pick="pickUser"/>
            </v-card>            
          </v-menu>              
        </v-row>
        <v-row class="pt-5"></v-row>
        <v-row class="text-caption pl-3">上级部门</v-row>
        <v-row>
          <v-col class="pt-0">
            <v-menu v-if="department" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="grey darken-1" v-bind="attrs" v-on="on" class="px-0" height="40" width="628" outlined>
                  <v-container>
                    <v-row class="px-3">
                      <v-chip v-if="department.pid" color="blue lighten-2" label @click:close="department.pid=null" close outlined>{{department.pid | department}}</v-chip>
                      <span v-else>请选择</span>                      
                      <v-spacer></v-spacer>                      
                      <v-icon>mdi-menu-down</v-icon>                     
                    </v-row>
                  </v-container>
                </v-btn>
              </template>
              <DepartmentPicker @pick="pickDepartment" />
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="pt-5"></v-row>
        <v-row class="text-caption pl-3">序号( 用于部门显示顺序 )</v-row>
        <v-row>
          <v-col class="pt-0">
            <v-text-field v-if="department" height="30" dense v-model="department.dp_order_number" placeholder="请输入整数" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="ma-0 pa-0">
      <v-container>
        <v-row class="pl-5">
          <v-spacer></v-spacer>
          <v-col class="pl-0">
            <v-container class="d-flex justify-end">
              <v-btn class="mx-1" small @click="cancel">取消</v-btn>
              <v-btn class="mx-1" small @click="agree" color="primary">确认</v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "NewDepartDlg",
  components: {
    DepartmentPicker: () => import("@/components/common/DepartmentPicker.vue"),
    UserPicker: () => import("@/components/common/UserPicker.vue")
  },
  props: ['department'],
  computed: {
    leaders: function () {
      if(this.department.dp_leader) {
        let leaders = this.department.dp_leader.split(',')
        leaders.splice(0, 1)
        return leaders
      } else {
        return []
      }
      
    }
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    ...mapActions('user', ['getUsers']),
    open() {
      this.dialog = true;
    },
    agree() {
      this.$emit('ok')
      this.dialog = false
    },
    cancel() {
      this.$emit('cancel')
      this.dialog = false
    },
    pickDepartment(e) {
      this.department.pid = e.data.id
    },
    pickUser(e) {
      let leaders = this.department.dp_leader.split(',')
      leaders.push(e.user.id)
      this.department.dp_leader = leaders.join()
    },
    removeLeader(id) {
      let leaders = this.department.dp_leader.split(',')
      const index = leaders.findIndex(user => user.id == id)
      leaders.splice(index, 1)
      this.department.dp_leader = leaders.join()
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>
<style>
</style>
