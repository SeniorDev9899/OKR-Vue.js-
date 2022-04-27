<template>
<v-container fluid>
  <v-row class="d-flex justify-start align-center">
    <v-btn  small class="ml-8 mx-1" @click="changeSuperior">修改直接上级</v-btn>
    <v-btn  small class="mx-1" @click="changeDSuperior">修改虚线上级</v-btn>
    <v-btn  small class="mx-1" @click="setDepartment">调整部门</v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn small class="mx-1" v-bind="attrs" v-on="on">...</v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <v-btn @click="makeResign" plain>设为离职</v-btn>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-btn  @click="resetPassword" plain>重置密码</v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <v-text-field v-model="search" class="mt-5 mr-7 ml-16" color="#00BFFF" height="30" dense append-icon="mdi-magnify" outlined placeholder="姓名、手机号、邮箱"></v-text-field>
  </v-row>
  <v-row>
    <v-col>
      <v-data-table :search="search" :headers="headers" :items="userData" show-select :single-select="false" item-key="id" v-model="selected">
        <template v-slot:item.deptId="{ item }">
          {{ item.deptId | department }}
        </template>
        <template v-slot:item.employeeName="{ item }">
          <span class="text-caption blue--text font-weight-light">{{ item.employeeName }}</span>
          <span v-if="item.user_role=='admin' || item.user_role=='creator'" class="text-caption blue--text font-weight-light">(老板)</span>
          <span v-else-if="item.leader_dps" class="text-caption blue--text font-weight-light">(部门领导)</span>
        </template>
        <template v-slot:item.user_superior="{ item }">
          {{ item.user_superior | username }}
        </template>
        <template v-slot:item.user_dot_superior="{ item }">
          {{ item.user_dot_superior | username }}
        </template>
        <template v-slot:item.status="{item}">
          <v-icon :color="getStatus(item.status).color">{{ getStatus(item.status).icon }}</v-icon>
          <v-btn @click="makeActive(item.id)" text color="primary" v-if="item.status == 2" small >激活</v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <SuperiorDlg ref="superiorDlg" />
  <DSuperiorDlg ref="dSuperiorDlg" />
  <SetDepartDlg ref="setDepartDlg" />
</v-container>
</template>

<script>
import {
  mapActions,
  mapGetters
} from "vuex";
import {
  messages
} from "@/constants/messages";
export default {
  name: "GroupView",
  components: {
    SuperiorDlg: () => import("@/components/admin/employee/SuperiorDlg.vue"),
    DSuperiorDlg: () => import("@/components/admin/employee/DSuperiorDlg.vue"),
    SetDepartDlg: () => import("@/components/admin/employee/SetDepartDlg.vue"),
  },
  computed: {
    ...mapGetters("user", ["users"]),
    ...mapGetters("department", ["departTree"]),
    ...mapGetters("auth", ["authUser"]),
    userData() {
      const flatten = (dp_departments, extractChildren) => Array.prototype.concat.apply(
        dp_departments, 
        dp_departments.map(x => flatten(extractChildren(x) || [], extractChildren))
      );
      const extractChildren = x => x.dp_departments;
      if(!!this.department) {
        let temp = this.users.filter(user => user.deptId === this.department.id)
        if(!!this.department.dp_departments){
          const flat = flatten(extractChildren(this.department), extractChildren).map(x => delete x.children && x);
          flat.map(item => {
            temp = temp.concat(this.users.filter(user => user.deptId === item.id))
          })
        }
        return temp.filter(user => user.status != 0);
      } else {
        return []
      }
    }
  },
  props: {
    department:{
      type: Object,
    }
  },
  data() {
    return {
      headers: [{
          text: "姓名 ",
          align: "start",
          sortable: false,
          value: "employeeName",
        },
        {
          text: "手机号码",
          value: "phone",
        },
        {
          text: "邮箱",
          value: "email",
        },
        {
          text: "部门",
          value: "deptId",
        },
        // {
        //   text: "职务",
        //   value: "postName",
        // },
        {
          text: "直接上级",
          value: "user_superior",
        },
        {
          text: "虚线上级",
          value: "user_dot_superior",
        },
        {
          text: "激活状态",
          value: "status",
        },
        // {
        //   text: "操作",
        //   value: "",
        // },
      ],
      selected: [],
      search: "",
    };
  },
  methods: {
    ...mapActions("user", ["getUsers", "updateUser"]),
    ...mapActions("department", ["getAllDepartments", "getDepartments"]),
    changeSuperior() {
      if (this.selected.length === 0) {
        this.$store.dispatch("app/setNotification", {
          status: "warning",
          text: messages.PICK_ONE_PERSON,
        });
      } else {
        this.$refs.superiorDlg.open(this.selected);
      }
    },
    changeDSuperior() {
      if (this.selected.length === 0) {
        this.$store.dispatch("app/setNotification", {
          status: "warning",
          text: messages.PICK_ONE_PERSON,
        });
      } else {
        this.$refs.dSuperiorDlg.open(this.selected);
      }
    },
    setDepartment() {
      if (this.selected.length === 0) {
        this.$store.dispatch("app/setNotification", {
          status: "warning",
          text: messages.PICK_ONE_PERSON,
        });
      } else {
        this.$refs.setDepartDlg.open(this.selected);
      }
    },
    getPosition(user) {
      if (!!user.user_dp_leader) {
        const departs = user.user_dp_leader.split(",");
        if (departs.includes(`${user.user_company_id}`)) {
          return "(老板)";
        } else {
          return "(部门领导)"
        }
        return "";
      }
    },
    makeResign() {
      if (this.selected.length === 0) {
        this.$store.dispatch("app/setNotification", {
          status: "warning",
          text: messages.PICK_ONE_PERSON,
        });
      } else {
        let ids=[]
        this.selected.map(user => {
          ids.push(user.id)
        })
        this.updateUser({
          ids: ids.join(),
          status: 0
        })
      }
    },
    makeActive(id) {
      this.updateUser({
        id: id,
        status: 1
      })
    },
    getStatus(value) {
      if(value == 1) {
        return {color: 'green', icon: 'mdi-check-circle-outline'}
      } else if(value == 2) {
        return {color: 'red', icon: 'mdi-alert-circle-outline'}
      }
    },
    resetPassword() {
      if (this.selected.length === 0) {
        this.$store.dispatch("app/setNotification", {
          status: "warning",
          text: messages.PICK_ONE_PERSON,
        });
      } else {
        let ids=[]
        this.selected.map(user => {
          ids.push(user.id)
        })
        this.updateUser({
          ids: ids.join(),
          user_password: 'admin'
        })
      }
    }
  },
  mounted() {
    this.getUsers();
    this.getAllDepartments();
    this.getDepartments();
  },
};
</script>
