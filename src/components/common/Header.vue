<template>
<v-system-bar height="40px" color="white" id="header" app>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-container fluid>
          <v-row class="d-flex justify-start">
            <v-img :src="images.logo" max-height="60" max-width="120"></v-img>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn depressed v-bind="attrs" v-on="on" plain>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-avatar size="30" color="green"><span class="text-caption">{{authUser.employeeName.slice(0,2)}}</span></v-avatar>
                      </v-col>
                      <v-col class="pt-5 pl-0">{{authUser.employeeName}}
                        <v-icon>mdi-menu-down</v-icon>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in menuItems" :key="index">
                  <v-list-item-title>
                    <v-btn plain :to="item.link">{{ item.title }}</v-btn>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn plain @click="logout">退出登录</v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</v-system-bar>
</template>

<script>
import Images from '@/constants/image.js'
import {
  mapGetters,
  mapActions
} from 'vuex'
import {
  Routes
} from '@/constants/routes'
export default {
  name: "Header",
  computed: {
    ...mapGetters('auth', ['authUser']),
    menuItems: function() {
      let temp = null;
      if(this.authUser.user_role=='admin' || this.authUser.user_role=='creator') {
        temp = [{
            title: '个人主页'
          },
          {
            title: '个人设置'
          },
          {
            title: '企业管理后台',
          },
          {
            title: '开启高级功能',
            link: Routes.ADMIN_EMPLOYEE_PAGE
          },
          {
            title: '企业管理规定',
          }
        ]
      } else {
        temp =  [{
            title: '个人主页'
          },
          {
            title: '个人设置'
          },
          {
            title: '企业管理后台',
          },
          {
            title: '企业管理规定',
          }
        ]
      }
      return temp;
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
  data() {
    return {
      images: Images
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
