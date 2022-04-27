<template>
<div class="text-center">
  <v-dialog v-model="dialog" width="600" persistent>
    <template v-slot:activator="{ on, attrs }">
      <span color="red lighten-2" dark v-bind="attrs" v-on="on">

      </span>
    </template>

    <v-card class="picker-content">
      <div style="display:none;">{{restore}}</div>
      <v-layout class="d-flex justify-space-between">
        <v-flex class="px-4 py-4">
          <v-text-field placeholder="搜索" outlined autofocus :min-height="36" id="search" dense append-icon="mdi-magnify" v-model="search" @click="stopParentEvent"></v-text-field>
          <div class="searched">
            <v-tabs v-model="tab" icons-and-text height="36">
              <v-tabs-slider width="124"></v-tabs-slider>
              <v-tab href="#tab-1">
                部门
              </v-tab>
              <v-tab href="#tab-2">
                群组
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="">
              <v-tab-item style="height:500px;" id="tab-1">
                <v-treeview activatable :items="departAndUser" v-if="search == ''">
                  <template v-slot:prepend="{ item, open }">
                    <v-btn v-if="item.departmentOaName" @click="selectDepartment(item)" plain small>{{ item.departmentOaName }}</v-btn>
                    <v-btn v-else @click="selectUser(item)" plain small>
                      <v-avatar class="mr-2" color="orange" size="30">{{ item.employeeName.charAt(0) }}</v-avatar>{{ item.employeeName }}
                    </v-btn>
                  </template>
                </v-treeview>
                <div class="py-4" v-if="search != ''">
                  <div class="py-1 cursor-pointer" v-for="depart in filteredDepartList" :key="depart.id">
                    <div @click="selectDepartment(depart)">
                      <v-icon style="font-size: 18px;">mdi-menu-right</v-icon>{{depart.departmentOaName}}
                    </div>
                  </div>
                  <div class="py-1 cursor-pointer" v-for="user in filteredUserList" :key="user.id">
                    <div @click="selectUser(user)">
                      <v-avatar class="mr-2" color="orange" size="30">{{ user.employeeName.charAt(0) }}</v-avatar>{{user.employeeName}}
                    </div>
                  </div>
                </div>
              </v-tab-item>
              <v-tab-item id="tab-2">
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-flex>
        <v-divider vertical></v-divider>
        <v-flex class="px-4 py-4">
          <div class="label d-flex justify-start align-center">已选： {{selectedUserCount == 0 ? '' : '人员' + selectedUserCount}} {{selectedDepartCount == 0 ? '' : '部门' + selectedDepartCount}}</div>
          <div class="selected mt-4">
            <div class="mt-2" v-for="(user, i) in selectedUser" :key="user.id" style="position:relative;">
              <v-avatar size="30" class="mx-2" color="#E65100">{{ user.employeeName.charAt(0).toUpperCase() }}</v-avatar>
              <span class="text-capitalize">{{ user.employeeName }}</span>
              <v-icon class="remove-icon" @click="removeUser(i)">mdi-close-circle</v-icon>
            </div>
            <div class="mt-2" v-for="(depart, i) in selectedDepartment" :key="depart.id" style="position:relative;">
              <!-- <v-avatar size="30" class="mx-2" color="#E65100">{{ depart.departmentOaName.charAt(0).toUpperCase() }}</v-avatar> -->
              <span class="text-capitalize">{{ depart.departmentOaName }}</span>
              <v-icon class="remove-icon" @click="removeDepart(i)">mdi-close-circle</v-icon>
            </div>
          </div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <div class="d-flex justify-end px-4 py-2">
        <v-spacer></v-spacer>
        <v-btn class="close mr-4" text @click="closeModal" outlined depressed>取消</v-btn>
        <v-btn class="save" text @click="saveSelectedData" depressed>确定</v-btn>
      </div>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  name: 'UserDepartmentTeamPicker',
  props: ['visibleRange'],
  data() {
    return {
      dialog: false,
      tab: null,
      search: "",
      selectedUser: [],
      selectedDepartment: []
    }
  },
  computed: {
    ...mapGetters("user", ["users"]),
    ...mapGetters("department", ["departTree", "departments"]),
    restore() {
      if(!!this.visibleRange) {
        let visibles = this.visibleRange.split(",");
        let userTmp = [];
        let departTmp = [];
        this.selectedUser = [];
        this.selectedDepartment = [];
        visibles.map(v => {
          if(v != '') {
            if(v.includes('u')) {
              userTmp.push(parseInt(v.replace('u', '')));
            }
            if(v.includes('d')) {
              departTmp.push(parseInt(v.replace('d', '')));
            }
          }
        });
        let filteredUser = this.users.filter(
            function(u) {
              return this.indexOf(u.id) >= 0;
            },
            userTmp
        );
        let filteredDepart = this.departments.filter(
            function(d) {
              return this.indexOf(d.id) >= 0;
            },
            departTmp
        );
        this.selectedUser = this.selectedUser.concat(filteredUser);
        this.selectedDepartment = this.selectedDepartment.concat(filteredDepart);
      }
    },
    filteredUserList() {
      return this.users.filter(user => {
        if (user.employeeName.toLowerCase().includes(this.search)) {
          return user
        }
      });
    },
    filteredDepartList() {
      return this.departments.filter(depart => {
        if (depart.departmentOaName.toLowerCase().includes(this.search)) {
          return depart
        }
      });
    },
    selectedUserCount() {
      return this.selectedUser.length;
    },
    selectedDepartCount() {
      return this.selectedDepartment.length;
    },
    departAndUser() {
      let tempArray = this.departTree
      const addMembers = (items) => {
        items.map(item => {
          if (item.dp_departments) {
            addMembers(item.dp_departments)
            item.children = this.users.filter(user => user.deptId == item.id).concat(item.dp_departments)
          } else {
            item.children = this.users.filter(user => user.deptId == item.id).concat(item.dp_departments)
          }

        })
      }
      addMembers(tempArray)
      return tempArray
    },

  },
  methods: {
    ...mapActions("user", ["getUsers"]),
    ...mapActions("department", ["getDepartments", "getAllDepartments"]),
    openDialog() {
      this.dialog = true;
    },
    selectDepartment(department) {
      let tmp = this.selectedDepartment.filter(d => d.id == department.id)
      if(tmp.length == 0) {
        this.selectedDepartment.push(department);
      }
    },
    selectUser(user) {
      if(this.selectedUser.length != 0) {
        let tmp = this.selectedUser.filter(u => u.id == user.id)
        if(tmp.length == 0) {
          this.selectedUser.push(user);
        }
      }else{
        this.selectedUser.push(user);
      }
    },
    stopParentEvent(ev) {
      ev.stopPropagation();
    },
    closeModal() {
      this.dialog = false;
      this.search = "";
    },
    saveSelectedData() {
      let param = {
        user: this.selectedUser,
        depart: this.selectedDepartment
      }
      this.$emit('selected', param)
      this.dialog = false;
      this.search = "";
      this.selectedUser = [];
      this.selectedDepartment = [];
    },
    removeUser(index) {
      this.selectedUser.splice(index, 1);
    },
    removeDepart(index) {
      this.selectedDepartment.splice(index, 1);
    }
  },
  mounted() {
    this.getUsers();
    this.getDepartments();
    this.getAllDepartments();
    // if(!!this.visibleRange) {
    //   let visibles = this.visibleRange.split(",");
    //   let userTmp = [];
    //   let departTmp = [];
    //   visibles.map(v => {
    //     if(v != '') {
    //       if(v.includes('u')) {
    //         userTmp.push(parseInt(v.replace('u', '')));
    //       }
    //       if(v.includes('d')) {
    //         departTmp.push(parseInt(v.replace('d', '')));
    //       }
    //     }
    //   });
    //   let filteredUser = this.users.filter(
    //       function(u) {
    //         return this.indexOf(u.id) >= 0;
    //       },
    //       userTmp
    //   );
    //   let filteredDepart = this.departments.filter(
    //       function(d) {
    //         return this.indexOf(d.id) >= 0;
    //       },
    //       departTmp
    //   );
    //   this.selectedUser = this.selectedUser.concat(filteredUser);
    //   this.selectedDepartment = this.selectedDepartment.concat(filteredDepart);
    // }
  }
}
</script>

<style scoped>
#tab-1 {
  max-height: 400px;
  overflow-y: scroll;
}

#tab-2 {
  max-height: 400px;
  overflow-y: scroll;
}

.v-input__slot {
  min-height: 36px !important;
}

.picker-content .flex {
  max-width: 50%;
}

.label {
  font-size: 14px;
  font-weight: 400;
  color: #3f4755;
  line-height: 22px;
  width: 100%;
}

.selected {
  min-height: 300px;
}

.selected>div:hover .remove-icon {
  display: inline-block;
  cursor: pointer;
  color: red;
}

.remove-icon {
  font-size: 14px;
  position: absolute;
  display: none;
}

.searched {
  min-height: 290px;
}

.v-text-field__details {
  display: none;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background: #eee;
}
</style>
