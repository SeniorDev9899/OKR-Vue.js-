<template>
<v-parallax :src="require('@/assets/images/auth_background.png')" height="1000" class="login-container">
  <v-card class="login-card">
    <v-card-title>
      <v-img :src="Images.logo" class="login-logo" max-height="60" max-width="120"></v-img>
    </v-card-title>
    <v-card-text style="padding-top: 30px">
      <v-container style="padding: 20px">
        <v-row>
          <v-text-field v-model="user.userPhone" placeholder="邮箱/手机号/用户名" prepend-inner-icon="mdi-email-outline"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field v-model="user.userPassword" type="password" placeholder="密码" prepend-inner-icon="mdi-lock-open-outline" @keydown.enter="signin"></v-text-field>
        </v-row>
        <v-row class="align-center">
          <v-col>
            <v-checkbox label="自动登录"></v-checkbox>
          </v-col>
          <v-col>
            <v-btn small elevation="0">忘记密码 </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-btn block color="primary" @click="signin">登录</v-btn>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <v-btn :to="{ path: 'signup' }" class="routeBtn" rounded>
    <span>还没账号？立即注册</span>
    <span class="arrow-right"></span>
  </v-btn>
</v-parallax>
</template>
<script>
import { mapActions } from 'vuex'
import { Routes } from '@/constants/routes'
import { constant } from '@/constants/constant.js'
import Images from '@/constants/image.js'
export default {
  data() {
    return {
      user: {
        userPhone: '',
        userPassword: '',
      },
      Images: Images
    }
  },
  methods: {
    ...mapActions("auth", ["loginUser"]),
    signin(){
      this.loginUser(this.user)
      .then(() => window.location.href = `${Routes.OKR_LIST_PAGE}/${constant.pageCount}/1`)
    }
  }
};
</script>

<style>
.login-container {
  height: 100% !important;
  position: relative;
}

.login-card {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 400px;
  height: 400px;
}

.login-logo {
  position: absolute;
  top: 10px;
  left: 120px;
}

.routeBtn {
  position: relative !important;
  top: 235px;
  left: calc(50% - 75px);
  width: 150px;
  height: 30px !important;
  background-color: rgba(10, 19, 26, .6) !important;
  font-size: 12px !important;
  line-height: 30px !important;
  color: #acb7bf !important;
  padding: 0 10px !important;
  transition: box-shadow .2s ease-in, color .2s ease;
}

.arrow-right {
  position: relative;
  top: 2px;
  width: 16px;
  height: 17px;
  background: url(//st-web.tita.com/titacn/tita/register/images/arraw-right.png) no-repeat;
}
</style>
