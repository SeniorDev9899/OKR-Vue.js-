<template>
<v-parallax :src="require('@/assets/images/auth_background.png')" height="1000" class="signup-container">
  <v-card width="50%" class="signup-card">
    <v-card class="landing_card_top">
      <v-card-title class="landing_card_title">
        <img src="https://stcms.beisen.com/Image/352728/232637ab8a674427a1d6489329035d86_n.png" class="modal_com_logo" />
        注册流程
        <v-spacer></v-spacer>
        注册后立即享受
        <span id="modNum">15</span>
        天免费试用
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAZCAYAAAABmx/yAAAAAXNSR0IArs4c6QAAAdFJREFUOBF1VDtOQzEQ9PtItByAnwQ1XQ5AR8ENKDgHPRJNLkEBJ0gRiSIVF0BcAEJPTfEwM+MdxwFlpZdd78zs2mtDd/eSc04w/nQMNsalMKZaHPHYARXfviUj7kJAXi2CeOxDUJMg924AjGxj5HJ7LDIOBPnRyDDIkDG8BQhTj6oUjw5Isoi5ai5qTwCxtlo7RtIib4vr2IyhEHLJikRba7s4H7zSsU0CEOYW8Dprsy5bxXnawmqKH59TaxA0IDaIwv+uQ3OJyalzEN1QOeg316HS3jM8K5htzCoKtSUC7tKAOgPW0kc+w+sBcO/1kEyyEX9sUVTLJr91RonAaHAt6lRdDL4IwSx/IjE9dNFLIhGxmjZH0ZMbItE+PRKroajfqjn05QFERw2Kiq29lhIaSmDlkZtEz2+rXVmK0mKIa8cqIMEkepqLYYuMy3VwAdPkSrhp4wIhEBxx6ciKIBlHkW98tyTiPPdwe8SDpnsu1wEFD8wGELxiSNdXR90bhYuP/DxN6RHwuXDkWKDndXDc45DyMKT56XGaWUQh47OTNAM+H/uUOXn+u+kW7zlDuEbi5vKgW5G8y5af+WL6SQ/AD9NynZ9WX3l/F/lvnlxqfgEIUZr+rBEq1gAAAABJRU5ErkJggg==" id="mod_flag" />
      </v-card-title>
    </v-card>

    <div class="line_mid">
      <div class="left_dashed"></div>
      <div class="line_dashed">
        <div class="middle-line-top"></div>
        <div class="middle-line-bottom"></div>
      </div>
      <div class="right_dashed"></div>
    </div>

    <v-card class="landing_card_bottom">
      <v-card-text style="padding-bottom: 0px;">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <validation-provider v-slot="{ errors }" name="phoneNumber" :rules="{
                required: true,
                digits: 7,
                }">
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-cellphone" hint="+86" label="手机号码" v-model="newUser.phone" :counter="7" :error-messages="errors" required />
                  </v-flex>
                </v-layout>
              </v-container>
            </validation-provider>
            <v-container align-center justify-start>
              <v-layout align-center justify-start row fluid style="margin: 0px;">
                <v-flex grow>
                  <v-text-field dense hide-details="auto" prepend-icon="mdi-security" label="图片验证码" />
                </v-flex>
                <v-flex shrink>
                  <img src="@/assets/images/signup.png" style="cursor: pointer; margin: 0px 15px; width: 130px;" />
                </v-flex>
                <v-flex shrink>
                  <v-btn disabled style="background-color: #2879CB !important; opacity: .5; color: white !important;">
                    获取短信验证码
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container align-center justify-start>
              <v-layout align-center justify-start column>
                <v-flex class="inputFieldRe">
                  <v-text-field dense hide-details="auto" prepend-icon="mdi-security" label="短信验证码" />
                </v-flex>
              </v-layout>
            </v-container>
            <validation-provider v-slot="{ errors }" name="userPassword" rules="required|max:20">
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" v-model="newUser.user_password" prepend-icon="mdi-lock" @click:append="() => (value = !value)" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" label="密码" :type="value ? 'password' : 'text'" :counter="20" :error-messages="errors" required />
                  </v-flex>
                </v-layout>
              </v-container>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Name" rules="required|max:10">
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-account" label="姓名" v-model="newUser.loginName" :counter="10" :error-messages="errors" required />
                  </v-flex>
                </v-layout>
              </v-container>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="companyName" rules="required|max:25">
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-account-multiple" label="企业名称" v-model="newUser.user_company_name" :counter="25" :error-messages="errors" required />
                  </v-flex>
                </v-layout>
              </v-container>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="checkbox" rules="required">
              <v-container align-center justify-start>
                <v-layout align-center justify-start row style="width: 100%; margin: 0px;">
                  <v-flex shrink style="margin-right: 5px;">
                    <v-checkbox v-model="checkbox" color="primary" label="我已阅读并同意" :error-messages="errors" value="1" type="checkbox" required />
                  </v-flex>
                  <v-flex>
                    <span style="color: rgb(0, 89, 153); font-size: 15px; cursor: pointer;">服务及隐私条款</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </validation-provider>
            <v-container align-center justify-start>
              <v-layout align-center justify-start column>
                <v-flex class="inputFieldRe">
                  <v-btn type="submit" :disabled="invalid" color="primary" class="submit">
                    注 册
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </validation-observer>
      </v-card-text>
      <div class="reg_footer">
        如有问题请联系 kefu@tita.com 或拔打电话 185 1139 1190
      </div>
    </v-card>
  </v-card>
  <v-btn :to="{ path: 'login' }" class="signup_routeBtn" rounded>
    <span>已有账号，马上登录</span>
    <span class="arrow-right"></span>
  </v-btn>
</v-parallax>
</template>

<script>
import {
  required,
  digits,
  email,
  max,
  regex
} from 'vee-validate/dist/rules';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate';
import {
  mapActions
} from "vuex";
setInteractionMode('eager');

extend('digits', {
  ...digits,
  message: '{_field_} needs to be {length} digits. ({_value_})',
});

extend('required', {
  ...required,
  message: '{_field_} can not be empty.',
});

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters.',
});

extend('regex', {
  ...regex,
  message: '{_field_} {_value_} does not match {regex}.',
});

extend('email', {
  ...email,
  message: 'Email must be valid.',
});

export default {
  data() {
    return {
      dialog: true,
      value: true,
      newUser: {
        loginName: '',
        user_password: '',
        phone: '',
        user_company_name: '',
        user_company_id: 1
      },
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    ...mapActions("auth", ["signup"]),
    submit() {
      this.signup(this.newUser)
        .then(res => {
          this.clear()
        })
    },
    clear() {
      this.newUser = {
        loginName: '',
        user_password: '',
        phone: '',
        user_company_name: '',
      }
    },
  }
}
</script>

<style>
.signup-card {
  position: relative !important;
  left: 25%;
  width: 50%;
  background-color: transparent;
  height: 740px;
}

.signup-container {
  height: 100% !important;
  position: relative;
}

.register_landing {
  margin-left: 0.1rem;
  line-height: 0.4rem;
  color: rgb(40, 121, 255) !important;
  cursor: pointer;
  background-color: white !important;
  box-shadow: none !important;
  font-size: 16px !important;
  padding: 0px !important;
}

.landing_card_top {
  height: 70px;
}

.landing_card_title {
  height: 100%;
  font-size: 16px !important;
  color: rgb(102, 117, 127);
  padding-right: 60px !important;
}

.modal_com_logo {
  width: 125px;
  height: 30px;
  display: block;
  margin-right: 10px;
}

#modNum {
  font-size: 30px !important;
  color: rgb(250, 166, 25);
  margin-right: 7px;
  margin-left: 7px;
}

#mod_flag {
  position: absolute;
  top: 0px;
  right: 30px;
}

.line_mid {
  height: 20px;
  position: relative;
  bottom: 3px;
}

.left_dashed {
  width: 10px;
  height: 25px;
  float: left;
  margin-right: -25px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAAAXNSR0IArs4c6QAAAOFJREFUOBGN0zEKwjAUxvFWBBEnJ0FwEQqewM1LCOIR3AQP4+IN3FxFPIWbQzfBycVFqFD/r+SVWJOYwEea934mGG1almWRJEmbBEeL7iUoTFPgIQYmHN0ndxIc1WaIKXmEZH0qaEiOPlxDeQClZEOK5ge+oC5A6yhodt/bWDf5mUGTKGh2PSuWCw+Nkzb/wTwW3mLhIBaOY+FMoXfmWkbkrdcTgltFMjsh9YWNnJDinDy9kEaP7JpA19XRLDKSa9E1y5+1S66upl2T33pFMue3sooCl9ba+yjvyItuxytM4wMpWX89nNV+vAAAAABJRU5ErkJggg==) left -2px no-repeat;
}

.line_dashed {
  float: left;
  width: 100%;
  height: 25px;
}

.middle-line-top {
  height: 12px;
  margin: 0px 10px;
  background-color: rgb(255, 255, 255);
  border-bottom: 2px dashed rgb(231, 238, 243);
}

.middle-line-bottom {
  height: 13px;
  margin: 0px 10px;
  background-color: rgb(255, 255, 255);
}

.right_dashed {
  width: 10px;
  height: 25px;
  float: right;
  margin-left: -25px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAAAXNSR0IArs4c6QAAANJJREFUOBFj/A8EDITBHybCasAqLhGrcCMjEVa/BJqpyQBSiAe8A8qZgS3Ho2gnUE4K7gcsCn8DxQqBmBGuCMTAojAPRQGMg6ZwJUwcg0ZTqIGhACaApHAvTAwbjRzgu7EpgIkhK7wHE8RGIyt8ik0BTAxZoThMEBuNrFAJmwKYGLJCG5ggVhopeP4A2bJYFYEEkRSCmFOJVQhSHIpVMUgGDXwG8oMwFKMpQubOAnK44RqQZbCw7wHFVMGKsUiiC90CCnASk7lABhYSq/AEsQp/AAA3eme4bt/JYgAAAABJRU5ErkJggg==) right -2px no-repeat;
}

.landing_card_bottom {
  height: 630px;
  border-top-right-radius: 0px !important;
  border-top-left-radius: 0px !important;
}

.inputFieldRe {
  width: 100%;
}

.reg_footer {
  padding: 20px 0px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 0px 0px 4px 4px;
  color: rgb(172, 183, 191);
  background: rgb(255, 255, 255);
  text-align: center;
}

.submit {
  width: 100%;
}

.signup_routeBtn {
  position: relative !important;
  top: 10px;
  left: calc(50% - 85px);
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
