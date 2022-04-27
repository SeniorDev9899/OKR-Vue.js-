<template>
  <div class="project-modal">
    <v-card-title class="header-modal">
      <v-text>创建项目</v-text>
      <v-spacer></v-spacer>
      <v-icon class="close-button"> mdi-close</v-icon>
    </v-card-title>
    <div class="body-field">
      <!--Input Name-->
      <div class="d-flex body-input">
        <v-text class="label-field">*名称</v-text>
        <v-text-field
          :rules="[rules.required, rules.min]"
          :type="show2 ? 'text' : 'text'"
          name="input-10-2"
          placeholder="项目名称最多100个字"
          style="font-size:14px;"
          hint="项目名称为必填项"
          value=""
          class="input-name"
          @click:append="show2 = !show2"
        ></v-text-field>
      </div>
      <!--Input Date Range -->
      <div class="d-flex body-input">
        <v-text class="label-field">起此时间</v-text>
        <div class="input-field">
          <v-menu offset-y :close-on-content-click="closeOnContentClick">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-text class="date-right">2021/06/26 - 2021/07/25</v-text>
              </div>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title><Datepicker /></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div class="justify-end">
            <v-icon>
              mdi-chevron-down
            </v-icon>
          </div>
        </div>
      </div>
      <!-- Name Search -->
      <div class="d-flex body-input">
        <v-text class="label-field">负责人</v-text>
        <div class="input-field" style="">
          <v-menu offset-y :close-on-content-click="closeOnContentClick">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-avatar
                  class="mx-2"
                  color="pink"
                  size="30"
                  style="color: white;"
                  >Jia</v-avatar
                >
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <SearchField />
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-text>JiangWang</v-text>
              </div>
            </template>
            <span style="font-size:12px;">修改负责人</span>
          </v-tooltip>
        </div>
      </div>
      <!-- Input Name Internal Man -->
      <div class="d-flex body-input">
        <v-text class="label-field">内部成员</v-text>
        <div class="input-field" style="">
          <v-menu offset-y :close-on-content-click="closeOnContentClick">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                  style="width: 30px; height: 30px;"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <SearchField />
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <v-text class="input-under-letter">如果有"企业外部人员"想要了解项目进展，或需要参与协作支持，可以创建项目后在"外部联系人"模块添加ta哦~</v-text>
      <!-- Input Followers Name -->
      <div class="d-flex body-input">
        <v-text class="label-field">关注者</v-text>
        <div class="input-field" style="">
          <v-menu offset-y :close-on-content-click="closeOnContentClick">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                  style="width: 30px; height: 30px;"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <SearchField />
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <!-- Input Approver Name -->
      <div class="d-flex body-input">
        <v-text class="label-field">审批人</v-text>
        <div class="input-field" style="">
          <v-menu offset-y :close-on-content-click="closeOnContentClick">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="green"
                  v-bind="attrs"
                  v-on="on"
                  style="width: 30px; height: 30px;"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <SearchField />
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-text class="input-letter-tianjia">不添加审批人， 默认不审批</v-text>
        </div>
      </div>
      <!-- Input project description -->
      <div class="d-flex body-input">
        <v-text class="label-field">项目描述</v-text>
        <v-text-field
          name="input-10-2"
          placeholder="请输入项目描述"
          style="font-size:14px;"
          value=""
          class="input-name"
        ></v-text-field>
      </div>
      <!-- Select Visible range -->
      <div class="d-flex body-input">
        <v-text class="label-field">可见范围</v-text>
        <div class="question-mark">?</div>
        <v-radio-group class="" v-model="row" row>
          <v-radio
            :label="`仅相关成员`"
            :value="n"
            style="font-size: 14px !important;"
          ></v-radio>
          <v-radio
            :label="`全公司`"
            :value="n"
          ></v-radio>
        </v-radio-group>
      </div>
      <!-- Upload File Field -->
      <div class="d-flex body-input">
        <v-text>上传附件</v-text>
        <div class="letter-space">
          <v-text style="color: #0095ff; padding-right: 10px;">点击上传</v-text>
          <v-text class="letter-small">请上传不超过50MB大少的文件， 最多可上传9个</v-text></v-text>
        </div>
      </div>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="dialog = false">
        取消
      </v-btn>
      <v-btn color="primary" text @click="dialog = false">
        创建
      </v-btn>
    </v-card-actions>
  </div>
</template>
<script>
import Datepicker from "@/components/okrgoal/tabView/DatePicker.vue";
import SearchField from "@/components/common/UserPicker.vue";
export default {
  components: {
    Datepicker,
    SearchField,
  },
  data() {
    return {
      show2: true,
      password: "Password",
      rules: {
        required: (value) => !!value || "项目名称为必填项.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        // emailMatch: () => `The email and password you entered don't match`,
      },
      closeOnContentClick: false,
    };
  },
  //   computed: {
  //     ...mapGetters("auth", ["authUser"]),
  //   },
};
</script>
<style>
.header-modal {
  padding: 4px;
  background: linear-gradient(90deg, #1d86f0 6%, #5cadff 94%);
  color: #fff;
  height: 40px;
  border-radius: 4px 4px 0 0;
  font-size: 16px;
  letter-spacing: 2px;
  padding-left: 15px;
  padding-right: 15px;
}
.close-button {
  color: white !important;
  font-size: 16px !important;
}
.body-field {
  padding: 10px 30px 10px 30px;
  align-items: center;
}
.input-field {
  margin-left: 24px;
  width: 95%;
  display: flex;
  font-size: 14px;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 9px;
  border-bottom: 1px solid #9c9c9c;
}
.input-name {
  margin-left: 24px;
}
.label-field {
  font-size: 14px;
  width: 60px;
  text-align: right;
  color: #70808B;
}
.body-input {
  align-items: center;
  font-size: 14px;
}
.project-modal .v-card__actions {
  padding: 10px 30px 10px 30px;
}
.body-input-down-icon {
  float: right;
}
.letter-space{
  margin-left: 24px;
  padding-top: 7px;
  padding-bottom: 6px;
}
.letter-small{
  font-size: 12px;
  color: #8f9ca6;
}
.question-mark{
  background: #cecaca;
  width: 17px;
  height: 17px;
  text-align: center;
  align-items: center;
  border-radius: 10px;
  color: white;
}
.project-modal .v-label{
  font-size:14px !important;
}
.input-under-letter{
  margin-left: 98px;
  font-size: 12px;
  color: #8f9ca6;
}
.input-letter-tianjia{
  color: #8f9ca6;
}
.date-right{
  margin-right: 575px;
}
</style>
