<template>
<div class="add-attention">
  <v-card-title class="header-modal">
    关注人员
    <v-spacer></v-spacer>
  </v-card-title>
  <!-- Search Field -->
  <div class="search-wrapper">
    <input type="text" class="search-user my-2 mx-2" v-model="search" placeholder="搜索" style="font-size:14px;" />
  </div>
  <span style="display:none;">{{render}}</span>
  <!-- Tab Field -->
  <v-container class="mb-3">
    <v-row>
      <v-col lg="6" style="border-right: 1px solid #bfbfbf;">
        <v-tabs v-model="tab" icons-and-text>
          <v-tab href="#tab-1">
            常用
          </v-tab>
          <!-- <v-tab href="#tab-2">
            下属
          </v-tab>
          <v-tab href="#tab-3">
            部门
          </v-tab> -->
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item style="height:300px;overflow-y:auto;" class="px-2 py-4" id="tab-1">
            <div v-if="!search" v-for="user in defaultUsers" class="image-box">
              <a class="py-1 user-item" @click="addItem(user)">
                <v-avatar size="30" color="green" light>{{
                    user.employeeName.slice(0, 1)
                  }}</v-avatar>
                {{ user.employeeName }}({{ user.loginName }})
              </a>
            </div>
            <div v-if="search" :class="{ current: user === value }" class="my-1" v-for="(user, i) in filteredList">
              <a class="my-1 user-item" @click="addItem(user)">
                <v-avatar size="30" color="green" light>{{
                    user.employeeName.slice(0, 1)
                  }}</v-avatar>
                {{ user.employeeName }}({{ user.loginName }})
              </a>
            </div>
          </v-tab-item>
          <v-tab-item id="tab-2">
            <v-card flat>
              <v-card-text>

              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab-3">
            <v-card flat>
              <v-card-text>
                <!-- <v-treeview :items="items"></v-treeview>-->
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <!-- Follow Person List -->
      <v-col lg="6">
        已关注0人
        <div v-for="(item, i) in value" class="my-1">
          <v-avatar size="30" color="green" light>{{
              item.employeeName.slice(0, 1)
            }}</v-avatar>
          {{ item.employeeName }}
          <button class="user-close-btn" @click="del(i)">
            <v-icon>
              mdi-close-circle
            </v-icon>
          </button>
        </div>
        <div class="my-10">
          <div class="right-field">

          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn class="close mr-4" text @click="closeModal" outlined depressed>取消</v-btn>
      <v-btn class="save mr-4" text @click="saveSelectedData" depressed>确定</v-btn>
    </v-row>
  </v-container>
</div>
</template>

<script>
import { getUser } from '@/utils/authUser.service';
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  props: ['attentions'],
  data() {
    return {
      search: "",
      tab: null,
      value: [],
      visible: false,
    };
  },
  computed: {
    ...mapGetters("user", ["users"]),
    filteredList() {
      return this.users.filter(user => {
        if (user.employeeName.toLowerCase().includes(this.search) ||
          user.phone.includes(this.search) ||
          user.loginName.toLowerCase().includes(this.search)) {
          return user
        }
      });
    },
    defaultUsers() {
      return this.users;
    },
    render() {
      this.value = this.attentions;
    }
  },
  methods: {
    ...mapActions("user", ["getUsers", "updateUser"]),
    closeModal() {
      this.$emit('closeModal');
    },
    saveSelectedData() {
      let attentionValue = ''
      this.value.map(user => {
        attentionValue += user.id + ',';
      });
      let payload = {
        id: getUser().id,
        user_attentions: attentionValue
      }
      if(this.value.length != 0) {
        this.updateUser(payload);
        this.$emit('closeModal')
      }
    },
    toggle() {
      this.visible = !this.visible;
    },
    select(option) {
      this.value = option;
    },
    addItem(item) {
      if(this.value.filter(u => u.id == item.id).length == 0) {
        this.value.push(item);
      }
    },
    del(index) {
      this.value.splice(index, 1);
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
.add-attention {
  font-size: 14px;
  width: 600px;
}

.aselect {
  width: 280px;
  margin: 20px auto;
}

.aselect .selector {
  border: 1px solid gainsboro;
  background: #f8f8f8;
  position: relative;
  z-index: 1;
}

.aselect .selector .arrow {
  position: absolute;
  right: 10px;
  top: 40%;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid #888;
  transform: rotateZ(0deg) translateY(0px);
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
}

.aselect .selector .expanded {
  transform: rotateZ(180deg) translateY(2px);
}

.aselect .selector .label {
  display: block;
  padding: 12px;
  font-size: 16px;
  color: #888;
}

.aselect ul {
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 16px;
  border: 1px solid gainsboro;
  position: absolute;
  z-index: 1;
  background: #fff;
}

.aselect li {
  padding: 12px;
  color: #666;
}

.aselect li:hover {
  color: white;
  background: seagreen;
}

.aselect .current {
  background: #eaeaea;
}

.aselect .hidden {
  visibility: hidden;
}

.aselect .visible {
  visibility: visible;
}

.search-user {
  box-sizing: border-box;
  position: relative;
  min-height: 36px;
  background: rgb(255, 255, 255);
  cursor: text;
  border: 1px solid rgb(233, 236, 240);
  border-radius: 4px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 7px 7px;
  transition: border 0.2s ease 0.2s, box-shadow 0.2;
  border: 1px solid rgb(40, 121, 255);
  box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
  width: 97%;
}

.search-user:focus {
  outline: none;
  border: 1px solid rgb(40, 121, 255);
  box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
}

.user-close-btn {
  float: right;
  align-items: center;
}

.add-attention .v-icon.v-icon {
  font-size: 15px;
}

.add-attention .v-icon.v-icon:hover {
  color: #df6767;
}

.add-attention .v-application .green {
  color: white !important;
}

.v-tabs--icons-and-text>.v-tabs-bar {
  max-height: 38px;
}

.user-item {
  display: inline-block;
  width: 100%;
}

.user-item:hover {
  background: #eee;
}
</style>
