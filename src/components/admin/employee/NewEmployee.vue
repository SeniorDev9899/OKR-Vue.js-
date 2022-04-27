<template>
<v-dialog persistent v-model="dialog" max-width="700">
  <v-card>
    <v-toolbar height="35" color="primary" dark>
      <v-container>
        <v-row>
          <v-col>
            新增员工
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1" class="pl-5">
            <v-icon @click="cancel">mdi-close</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar>
    <v-card-text>
      <v-container class="pa-5" fluid>
        <v-row>
          <div class="text-caption">姓名*</div>
        </v-row>
        <v-row>
          <v-text-field v-model="newUser.employeeName" dense placeholder="请输入" outlined></v-text-field>
        </v-row>
        <v-row>
          <div class="text-caption">手机号*</div>
        </v-row>
        <v-row>
          <v-text-field v-model="newUser.phone" dense placeholder="请输入" outlined></v-text-field>
        </v-row>
        <v-row>
          <div class="text-caption">密码*</div>
        </v-row>
        <v-row>
          <v-text-field v-model="newUser.user_password" dense type="password" placeholder="请输入" outlined></v-text-field>
        </v-row>
        <v-row>
          <div class="text-caption">邮箱*</div>
        </v-row>
        <v-row>
          <v-text-field v-model="newUser.email" dense placeholder="请输入" outlined></v-text-field>
        </v-row>
        <!-- 
        <v-row>
          <v-col class="pt-0">
            <v-text-field dense label="直接上级" placeholder="请选择" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-text-field dense label="虚线上级" placeholder="请选择" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-text-field dense label=" 职务" placeholder="请选择" outlined></v-text-field>
          </v-col>
        </v-row>
        -->
        <v-row>
          <div class="text-caption">部门*</div>
        </v-row>
        <v-row>
          <v-menu offset-y>
            <template v-slot:activator="{attrs, on}">
              <v-btn v-bind="attrs" v-on="on" class="justify-start px-3" height="40" color="grey" outlined block>
                {{ newUser.deptId | department }}
              </v-btn>
            </template>
            <v-card height="200">
              <DepartmentPicker @pick="selectDepart"/>
            </v-card>
          </v-menu>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="ma-0 pa-0">
      <v-container class="d-flex justify-end">
        <v-btn class="mx-1" small @click="cancel">取消</v-btn>
        <v-btn class="mr-7 ml-1" small @click="agree" color="primary">确认</v-btn>
      </v-container>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'NewEmployeeDlg',
  components: {
    DepartmentPicker: () => import('@/components/common/DepartmentPicker.vue')
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      newUser: {
        employeeName: '',
        phone: '',
        user_password: '',
        email: '',
        deptId: null,
      }
    }
  },
  methods: {
    ...mapActions('user', ['createUser']),
    open(department) {
      this.dialog = true
      this.newUser.deptId = department
    },
    agree() {
      this.newUser.user_company_id = this.authUser.user_company_id
      this.createUser(this.newUser)
      this.dialog = false
    },
    cancel() {
      this.dialog = false
    },
    selectDepart(e) {
      this.newUser.deptId = e.data.id
    }
  }
}
</script>

<style>

</style>
