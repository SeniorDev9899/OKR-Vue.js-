<template>
<v-system-bar height="40px" color="white" id="header" app>
  <v-container fluid>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-col class="pt-6" cols="2">
              <router-link style="color:blue; text-decoration:none;" :to="`/home/okr_goal/list/${pageCount}/1`"><v-icon style="color:blue">mdi-undo</v-icon> 返回</router-link>
            </v-col>
            <v-col cols="2">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn plain v-bind="attrs" v-on="on">
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-avatar size="30" color="green">{{authUser.employeeName.slice(0,3)}}</v-avatar>
                        </v-col>
                        <v-col class="pt-5 pl-0">{{authUser.logineName}} <v-icon>mdi-menu-down</v-icon></v-col>
                      </v-row>
                    </v-container>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <v-btn plain @click="logout">退出登录</v-btn>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</v-system-bar>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import { Routes } from '@/constants/routes'
import { constant } from '@/constants/constant.js'

export default {
  name: "Header",
  computed: {
    ...mapGetters('auth', ['authUser']),
    pageCount: function() {
      return constant.pageCount;
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
  data() {
    return {
      menuItems: [{
          title: '个人主页'
        },
        {
          title: '个人设置'
        },
        {
          title: '企业管理后台'
        }
      ]
    }
  }
};
</script>

<style>
#header {
  border-bottom: 1px solid grey !important;
}

.com_logo {
  width: 117px;
  height: 30px;
  display: block;
  margin-top: 0px;
}

.com_name {
  display: block;
  float: left;
  margin-left: 15px;
  line-height: 36px;
  color: #66757f;
  font-size: 14px;
  max-width: 160px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.com_des {
  width: 122px;
  height: 22px;
  margin-left: 15px;
}

.chat_room {
  margin-top: 7px;
}

.tita {
  line-height: 40px;
  font-size: 12px;
  color: #2879ff;
  cursor: pointer;
  margin-left: 20px;
  margin-right: 20px;
}

.chat_room_2 {
  margin-top: 7px;
  margin-right: 5px;
  color: #2879ff;
}

#red_ch {
  margin-left: 10px;
}

.chat_room_3 {
  margin-top: 10px;
  margin-right: 5px;
  color: #2879ff;
}

#chat_3 {
  margin-left: 20px;
  margin-right: 2px;
  vertical-align: middle;
}
</style>
