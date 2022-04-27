<template>
<v-app-bar app color="white" flat>
  <v-container align-center justify-start fluid grid-list-sm style="padding-top: 35px;">
    <v-layout row d-flex>
      <v-flex grow>
        <v-container align-center justify-center>
          <v-layout align-center justify-center row d-flex>
            <v-spacer></v-spacer>
            <v-flex grow>
              <img src="https://stcms.beisen.com/Image/352728/232637ab8a674427a1d6489329035d86_n.png" class="land_com_logo" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-flex shrink>
        <v-btn class="land_header_btn">
          产品
          <v-icon class="land_dropdown">
            mdi-menu-down
          </v-icon>
        </v-btn>
        <v-btn class="land_header_btn">
          服务
          <v-icon class="land_dropdown">
            mdi-menu-down
          </v-icon>
        </v-btn>
        <v-btn class="land_header_btn">
          价格
        </v-btn>
        <v-btn class="land_header_btn">
          App 下载
        </v-btn>
        <v-btn class="land_header_btn">
          TITA 宝典
          <v-icon class="land_dropdown">
            mdi-menu-down
          </v-icon>
        </v-btn>
        <v-btn class="land_header_btn">
          <v-icon>
            mdi-phone-outline
          </v-icon>
          400-650-3180
        </v-btn>
        <v-btn class="login_landing">
          登录
        </v-btn>
        <v-btn class="wechat_landing">
          微信注册
        </v-btn>

        <v-dialog v-model="dialog" width="50%">
          <!-- persistent -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="register_landing" v-bind="attrs" v-on="on">
              手机号注册
            </v-btn>
          </template>

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
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-cellphone" hint="+86" label="手机号码" />
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container align-center justify-start>
                <v-layout align-center justify-start row fluid style="margin: 0px;">
                  <v-flex grow>
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-security" label="图片验证码" />
                  </v-flex>
                  <v-flex shrink>
                    <img src="@/assets/images/landing.png" style="cursor: pointer; margin: 0px 15px; width: 130px;" />
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
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field :value="userPassword" dense hide-details="auto" prepend-icon="mdi-lock" @click:append="() => (value = !value)" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" label="密码" :type="value ? 'password' : 'text'" @input="_=>userPassword=_" />
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-account" label="姓名" />
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-text-field dense hide-details="auto" prepend-icon="mdi-account-multiple" label="企业名称" />
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container align-center justify-start>
                <v-layout align-center justify-start row style="width: 100%; margin: 0px;">
                  <v-flex shrink style="margin-right: 5px;">
                    <v-checkbox v-model="selected" color="primary" label="我已阅读并同意" />
                  </v-flex>
                  <v-flex>
                    <span style="color: rgb(0, 89, 153); font-size: 15px; cursor: pointer;">服务及隐私条款</span>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container align-center justify-start>
                <v-layout align-center justify-start column>
                  <v-flex class="inputFieldRe">
                    <v-btn disabled style="background-color: #2879CB !important; opacity: .5; color: white !important; width: 100%;">
                      注 册
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <div class="reg_footer">
              如有问题请联系 kefu@tita.com 或拔打电话 185 1139 1190
            </div>
          </v-card>

          <!-- <v-btn
                  @click="dialog = false"
                  class = "modRem"
                >
                  <v-icon
                      style = "font-size: 32px !important;"
                  >
                    mdi-alpha-x
                  </v-icon>
                </v-btn> -->
        </v-dialog>
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
  </v-container>
</v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      value: true,
      userPassword: "",
      rules: {
        required: value => !!value || "Required.",
        password: value => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          return (
            pattern.test(value) ||
            "Min. 8 characters with at least one capital letter, a number and a special character."
          );
        }
      }
    }
  }
};
</script>

<style>
.land_com_logo {
  width: 140px;
  height: 38px;
  display: block;
  margin-top: 0px;
}

.modal_com_logo {
  width: 125px;
  height: 30px;
  display: block;
  margin-right: 10px;
}

.land_dropdown {
  transition: all 0.3s ease;
}

.land_header_btn:hover .land_dropdown {
  transform: rotate(180deg);
}

.login_landing {
  border-radius: 0.74rem 0.74rem 0.02rem !important;
  background: rgb(255, 255, 255) !important;
  border-radius: 0.74rem 0.74rem 0.02rem;
  color: rgb(40, 121, 255) !important;
  transition: all 0.2s ease-in 0s;
  box-sizing: border-box !important;
  box-shadow: none !important;
  border: 3px solid;
  margin-right: 8px;
  font-size: 16px !important;
}

.wechat_landing {
  border-radius: 0.74rem 0.74rem 0.74rem 0.02rem !important;
  color: rgb(255, 255, 255) !important;
  width: 5.8rem;
  border: 2px solid rgb(40, 121, 255);
  background: rgb(40, 121, 255) !important;
  transition: all 0.2s ease-in 0s;
  box-sizing: border-box !important;
  margin-right: 8px;
  font-size: 16px !important;
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

.land_header_btn {
  background-color: white !important;
  border: 0px !important;
  box-shadow: none !important;
  font-size: 16px !important;
}

.landing_card_top {
  height: 70px;
}

.landing_card_bottom {
  height: 586px;
  border-top-right-radius: 0px !important;
  border-top-left-radius: 0px !important;
}

.landing_card_title {
  height: 100%;
  font-size: 16px !important;
  color: rgb(102, 117, 127);
  padding-right: 60px !important;
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

.right_dashed {
  width: 10px;
  height: 25px;
  float: right;
  margin-left: -25px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAAAXNSR0IArs4c6QAAANJJREFUOBFj/A8EDITBHybCasAqLhGrcCMjEVa/BJqpyQBSiAe8A8qZgS3Ho2gnUE4K7gcsCn8DxQqBmBGuCMTAojAPRQGMg6ZwJUwcg0ZTqIGhACaApHAvTAwbjRzgu7EpgIkhK7wHE8RGIyt8ik0BTAxZoThMEBuNrFAJmwKYGLJCG5ggVhopeP4A2bJYFYEEkRSCmFOJVQhSHIpVMUgGDXwG8oMwFKMpQubOAnK44RqQZbCw7wHFVMGKsUiiC90CCnASk7lABhYSq/AEsQp/AAA3eme4bt/JYgAAAABJRU5ErkJggg==) right -2px no-repeat;
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

.modRem {
  position: absolute !important;
  width: 20px !important;
  top: calc(100% - 850px) !important;
  right: calc(100% - 79%) !important;
  height: 50px !important;
  border-radius: 50% !important;
}
</style>
