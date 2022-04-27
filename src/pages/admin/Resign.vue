<template>
<v-container fluid style="height:100%" class="grey lighten-2">
  <v-row>
    <v-col class="d-flex align-center px-7">
      <v-icon color="primary">mdi-file-document</v-icon>
      <span class="text-Heading 6">离职员工</span>
      <v-spacer></v-spacer>
      <!-- assign employee-->
      <v-btn :disabled="authUser.user_role!=='creator'" @click="assignEmployee" color="primary">设为在职</v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="grey lighten-5 ma-3">
      <v-container fluid>
        <v-data-table 
        :items="userData" 
        show-select
        item-key="id"
        v-model="selected"
        :single-select="false"
        :headers="headers">
          <template v-slot:item.deptId="{ item }">
            {{ searchDepart(item.deptId) }}
          </template>
          <template v-slot:item.user_superior="{ item }">
            {{ item.user_superior | username }}
          </template>
          <template v-slot:item.user_dot_superior="{ item }">
            {{ item.user_dot_superior | username }}
          </template>
        </v-data-table>
      </v-container>
    </v-col>
  </v-row>

</v-container>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import {
  messages
} from "@/constants/messages";
export default {
  components: {

  },
  computed: {
    ...mapGetters('user', ['users']),
    ...mapGetters("department", ["allDepartments"]),
    ...mapGetters('auth', ['authUser']),
    userData() {
      return this.users.filter(user => user.status === 0)
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
          text: "部门",
          value: "deptId",
        },
        {
          text: "职务",
          value: "",
        },
        {
          text: "邮箱",
          value: "",
        },
        {
          text: "手机号码",
          value: "phone",
        },
        {
          text: "直接经理",
          value: "user_superior",
        },
        {
          text: "虚线经理",
          value: "user_dot_superior",
        },
        {
          text: "在职或离职",
          value: "",
        },
        {
          text: "账号状态",
          value: "",
        },
      ],
      selected: []
    }
  },
  methods: {
    ...mapActions('user', ['getUsers', 'updateUser']),
    ...mapActions("department", ["getAllDepartments"]),
    searchDepart(id) {
      const index = this.allDepartments.findIndex((item) => item.dp_id === id);
      return !!this.allDepartments[index]
        ? this.allDepartments[index].dp_name
        : "default";
    },
    assignEmployee() {
      if (this.selected.length === 0) {
        this.$store.dispatch("app/setNotification", {
          status: "warning",
          text: messages.PICK_ONE_PERSON,
        });
      } else {
        this.selected.map(user => {
          this.updateUser({
            id: user.id,
            status: 2
          })
        })
      }
    }
  },
  mounted() {
    this.getUsers({status: 2})
    this.getAllDepartments();
  }
}
</script>
