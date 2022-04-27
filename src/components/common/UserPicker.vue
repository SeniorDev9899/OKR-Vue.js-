<template>
<v-container ref="picker">
  <v-row>
    <v-card elevation="0" width="300" height="40" class="pa-2 mb-2">
      <v-text-field type="text" dense v-model="search" :autofocus="true" placeholder="搜索" outlined append-icon="mdi-magnify" @click="stopParentEvent" />
    </v-card>
  </v-row>
  <v-row>
    <v-card v-on:scroll="onScroll" elevation="0" width="300" height="400" class="" style="overflow-y:auto;overflow-x:hidden;" class="mt-3">
      <v-divider class="mb-3"></v-divider>
      <div style="min-height:300px;" class="pa-1">
        <div ref="users" ></div>
        <v-btn v-for="(user, i ) in filteredList" block @click="select(user)" :key="user.id" class="d-flex elevation-0 justify-start align-center ma-1" color="#BBDEFB">
          <v-avatar size="30" class="mx-2" color="#E65100">{{ user.employeeName.charAt(0).toUpperCase() }}</v-avatar>
          <span class="text-capitalize">{{ user.employeeName }} ({{ user.loginName }})</span>
        </v-btn>
      </div>
    </v-card>
  </v-row>
</v-container>
</template>

<script>
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  data() {
    return {
      search: "",
      userList: [],
      scrolled: false
    };
  },
  computed: {
    ...mapGetters("user", ["users"]),
    filteredList() {
      if(!!this.search) {
        this.userList = this.users
      }
      return this.userList.filter(user => {
        if (user.employeeName.toLowerCase().includes(this.search) ||
          user.loginName.toLowerCase().includes(this.search) && user.status == 1) {
          return user
        }
      });
    },
  },
  methods: {
    ...mapActions("user", ["getUsersCallBack"]),
    select(user) {
      this.$emit('pick', {
        user: user
      })
    },
    stopParentEvent(ev) {
      ev.stopPropagation();
    },
    onScroll() {
      if(!this.scrolled) {
        this.scrolled = true
      } else {
        if(this.userList.length<this.users.length) {
          this.userList = this.users
        }
      }
    }
  },
  mounted() {
    this.getUsersCallBack().then(() => {
      for(let i = 0; i < 10; i++) {
        this.userList.push(this.users[i])
      }
    })
    this.$nextTick(function() {
      document.addEventListener('scroll', this.onScroll);
      this.onScroll(); // needed for initial loading on page
    });       
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.onScroll);
  }
}
</script>

