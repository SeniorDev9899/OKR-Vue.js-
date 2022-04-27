<template>
<v-container fluid>
  <v-row class="d-flex justify-start align-center">
    <span class="text-h6 ma-3">部门管理</span>
    <v-spacer></v-spacer>
    <v-btn @click="createDepart" class="mx-3" small color="primary">新增</v-btn>
    <!-- <v-text-field v-model="search" class="mt-5 mr-7 ml-16" color="#00BFFF" height="30" dense append-icon="mdi-magnify" outlined placeholder="部门"></v-text-field> -->
  </v-row>
  <v-row>
    <zk-table 
      :data="departTree" 
      :columns="headers" 
      children-prop="dp_departments"
      index-text="#"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
      :selection-type="props.selectionType">
        <template slot="leader" scope="scope">
          {{ scope.row.id | username }}
        </template>
        <template slot="edit" scope="scope">
          <v-icon  @click="deleteDepartment(scope.row)" class="mx-2">mdi-delete-outline</v-icon>
          <v-icon  @click="editDepartment(scope.row)" class="mx-2">mdi-pencil-outline</v-icon>
        </template>
      </zk-table>
  </v-row>
  <UpdateDepartDlg @ok="changeDepartment" v-bind:department="currentDepartment" ref="updateDepartDlg"/>
  <ConfirmDlg  ref="confirmDlg"/>
  <NewDepartDlg v-bind:department="newDepartment" @ok="addNewDepartment" ref="newDepartDlg"/>
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
  components: {
    UpdateDepartDlg: () => import('@/components/admin/UpdateDepartDlg.vue'),
    ConfirmDlg: () => import('@/components/common/ConfirmDlg.vue'),
    NewDepartDlg: () => import('@/components/admin/employee/NewDepartDlg.vue')
  },
  computed: {
    ...mapGetters("user", ["users"]),
    ...mapGetters("department", ["departments", "departTree"]),
    ...mapGetters("auth", ["authUser"]),
  },
  props: {
    department:{
      type: Object,
    }
  },
  data() {
    return {
      headers: [{
          label: "部门",          
          prop: "departmentOaName",
        },
        {
          label: "部门负责人",
          prop: "leader",
          type: "template",
          template: "leader"
        },
        {
          label: "操作",
          prop: "edit",
          type: "template",
          template: "edit"
        },
      ],
      currentDepartment: {},
      search: "",
      props: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
      },
      newDepartment: {
        departmentOaName: '',
        dp_leader: '',
        pid: '',
        dp_order_number: 0
      }
    };
  },
  methods: {
    ...mapActions("user", ["getUsers", "updateUser"]),
    ...mapActions("department", ["getAllDepartments", "removeDepartment", "updateDepartment", "getDepartments", "addDepartment"]),
    async deleteDepartment(item) {
      if(await this.$refs.confirmDlg.open('确定删除此部门吗？', '该部门下的子部门将被一起删除，部门成员将自动从该部门移出', {})) {
        this.removeDepartment({id: item.id})
      }
      // 
    },
    editDepartment(item) {
      this.currentDepartment = {...item}
      this.$refs.updateDepartDlg.open()
    },
    changeDepartment() {
      this.updateDepartment(this.currentDepartment)
    },
    createDepart() {
      this.$refs.newDepartDlg.open()
    },
    addNewDepartment() {
      this.addDepartment(this.newDepartment)
    }
  },
  mounted() {
    this.getUsers();
    this.getAllDepartments();
    this.getDepartments();
  },
};
</script>
