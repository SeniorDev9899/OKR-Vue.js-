<template>
    <v-navigation-drawer v-model="show" absolute right temporary width="590" overlay-color="white" overlay-opacity="0" color="rgb(250, 251, 252)" class="okr_user_right_editor">
      <v-container>
            <v-layout class="w100">
                <v-flex d-flex align-center justify-end class="w100">
                    <v-icon @click="close" class="okr_user_close">mdi-close</v-icon>
                </v-flex>
            </v-layout>
            <v-layout class="w100">
                <v-flex v-if="!!userInfo" d-flex align-center justify-start class="w100">
                    <v-avatar color="rgb(121, 199, 183)" size="35">{{ userInfo.employeeName.substring(0, 1) }}</v-avatar>
                    <span class="user_name">{{ userInfo.employeeName }}</span>
                    <span>
                        <span class="mr-1 year_quarter">({{ yearArray[selectedYear] }}<span>-</span><span style="margin-left:5px;">{{ quaterArray[active].text }})</span></span>
                    </span>
                </v-flex>
            </v-layout>
            <v-layout d-flex align-center justify-start row class="w100 m_0 pt_20" style="margin-top:50px;">
                <v-flex d-flex align-center justify-start>
                    <span class="comment">评论沟通</span>
                </v-flex>
                <v-flex d-flex align-center justify-end>
                    <span class="reply" @click="clickIcInput"><v-icon class="user-intercom-message">mdi-message-text-outline</v-icon><span class="user-intercom-reply">回复</span></span>
                    <span style="margin-left:5px;margin-right:5px;">|</span>
                    <span class="thumb"><v-icon class="user-intercom-thumb">mdi-thumb-up-outline</v-icon><span class="user-intercom-thumb_setting">点赞</span></span>
                </v-flex>
            </v-layout>
            <v-layout d-flex align-center justify-start class="w100" style="margin-top:20px;">
                <v-flex align-center justify-start class="w100 progress_bottom_down cursorPointer" @click = "displayIntercomListMore">
                    <span class="progress_bottom_down_btn">全部沟通 {{ userIntercom.length }}</span>
                    <v-icon class="progress_bottom_down_btn triple_down_icon" :class = "triple_down ? 'triple_down_icon_rotation' : ''">mdi-chevron-triple-down</v-icon>
                </v-flex>
            </v-layout>
            <v-layout d-flex align-center justify-start column class="w100">
                <v-flex class="progress_bottom mt_10 progress_bottom-userInfo">
                    <v-layout align-center justify-start column>

                        <IntercomItem 
                            v-if = "intercomArray.length !=0"
                            v-for = "ic in intercomArray"
                            :key = "ic.ic_id"
                            :ic_id = "ic.ic_id"
                            :timestamp = "ic.created_at"
                            :files = "ic.ic_files"
                            :value = "ic"
                            :user_name = "ic.ic_sender_name"
                            :sender_id = "ic.ic_sender"
                            @displayBtns = "handle_displayBtns"
                            @deleteCertainIntercom = "handle_deleteCertainIntercom"
                            @updateIntercom = "handle_updateIntercom"
                        />

                        <v-flex class="progress_bottom" :class="displayHiddenBtns ? 'show_editBtns' : 'hided_editBtns'" style="transition: all .5s ease;">
                            <v-container style="height: 100%;">
                            <v-layout align-center justify-start row class="hided_layout">
                                <v-flex shrink class="progress_bottom_down_btn" style="margin-right: 20px;">回复</v-flex>
                                <v-flex class="progress_bottom_down_btn" @click="hideBtns">
                                {{ ic_sender | username }}
                                <v-icon class="hide_btns">
                                    mdi-close-circle-outline
                                </v-icon>
                                </v-flex>
                            </v-layout>
                            </v-container>
                        </v-flex>
                        
                        <v-form class = "w100">

                            <v-flex ref="intercom" class="progress_bottom" >
                                <v-textarea 
                                    ref = "intercomDescription"
                                    background-color="white"
                                    filled
                                    auto-grow
                                    hide-details
                                    outlined
                                    v-model = "ic_desc"
                                    @input = "inputIcDescription"
                                >
                                </v-textarea>
                            </v-flex>

                            <v-flex class="progress_bottom" style="background-color:white;">
                                <v-layout align-center justify-start row class="w100 progress_bottom-layout m_0">
                                    <v-flex class="task_mr_5">
                                        <span class="w100 d-flex align-center justify-center">
                                            <span @click="fileInput" class="file_input w100"><v-icon class="btn_2-icons">mdi-paperclip</v-icon><span>附件</span></span>
                                            <input type="file" ref="fileIntercom" style="display:none;" @change="setFileForIntercom">
                                        </span>
                                    </v-flex>
                                    <v-flex class="task_mr_5">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" class="file_input w100">
                                                    <span>@ 同事</span>
                                                </span>
                                            </template>
                                            <v-card>
                                                <UserPicker @pick="pickUser" />
                                            </v-card>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                                        <span class="file_input w100" @click="allMembers">
                                            <span>@ 所有同事</span>
                                        </span>
                                    </v-flex>
                                    <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                                        <EmojiPicker @inputEmoji="handle_inputEmoji" />
                                    </v-flex>
                                    <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5" >
                                        <span class="file_input w100">
                                            <v-checkbox class="sms" v-model="sms" label="短信通知" hide-details></v-checkbox>
                                        </span>
                                    </v-flex>
                                    <v-flex class = "btn ic_bottomBtn displayFlex_Interactive_Bottom ml_5">
                                        <v-btn 
                                        color = "primary" 
                                        :disabled = "enableIcSubmitBtn ? false : true"
                                        @click = "submitIcDescription"
                                        >回复</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-form>
                    </v-layout>
                </v-flex>
                <v-flex v-if="display_files && intercomFiles.length != 0" class="width100 files_mt_10">
                    <v-layout d-flex align-center justify-start row class="width100 m_0">
                        <v-flex v-for="(file, index) in intercomFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15">
                        <v-layout d-flex align-center jsutify-start row class="width100 m_0">
                            <v-flex shrink><v-icon color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon></v-flex>
                            <v-flex d-flex align-center justify-start grow><span style="color:rgb(100, 116, 129);">{{ file.file_name.split(".")[0] }}</span></v-flex>
                            <v-flex shrink><span style="color:rgb(45, 171, 146);margin-right:10px;font-size:12px;">文件上传成功</span></v-flex>
                            <v-flex shrink class="file_remove"><v-icon size="15" color="rgb(169, 184, 191)" style="cursor:pointer;" class="file_remove_close" @click="removeFile(file.file_id)">mdi-close-circle</v-icon></v-flex>
                        </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-navigation-drawer>
</template>

<script>
import IntercomItem from "@/components/okrgoal/rightInfo/interactive/intercom/IntercomItem.vue";
import EmojiPicker from '@/components/common/EmojiPicker.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import { constant } from "@/constants/constant.js";
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            show: false,
            userInfo: null,
            yearArray: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
            quaterArray: [
                { text: "全部周期", value: "/1000" },
                { text: "年度", value: "/0" },
                { text: "第一季度", value: "/1" },
                { text: "第二季度", value: "/2" },
                { text: "第三季度", value: "/3" },
                { text: "第四季度", value: "/4" },
                { text: "1月", value: "-1" },
                { text: "2月", value: "-2" },
                { text: "3月", value: "-3" },
                { text: "4月", value: "-4" },
                { text: "5月", value: "-5" },
                { text: "6月", value: "-6" },
                { text: "7月", value: "-7" },
                { text: "8月", value: "-8" },
                { text: "9月", value: "-9" },
                { text: "10月", value: "-10" },
                { text: "11月", value: "-11" },
                { text: "12月", value: "-12" }
            ],
            selectedYear: 1,
            active: 1,
            triple_down: false,
            intercomArray: [],
            displayHiddenBtns: false,
            enableIcSubmitBtn : false,
            ic_desc: "",
            sms: false,
            ic_reply_ic: "",
            display_files: false,
            ic_sender: null,
        }
    },
    components: {
        IntercomItem,
        EmojiPicker,
        UserPicker
    },
    created() {
        this.initFiles({type:"intercom"}); 
    },
    computed: {
        ...mapGetters('intercom', ['userIntercom']),
      ...mapGetters('fileUpload', ['intercomFiles']),
    },
    methods: {
        ...mapActions('intercom', ['getIntercom', 'addIntercom', 'deleteIntercom', 'updateIntercom']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        open(param) {
            this.show = true;
            this.userInfo = param.user;
            this.currentYear();
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let start, end, cycle;
            if(month >= 1 && month <= 3) {
                month = '/1';
            }
            if(month >= 4 && month <= 6) {
                month = '/2';
            }
            if(month >= 7 && month <= 9) {
                month = '/3';
            }
            if(month >= 10 && month <= 12) {
                month = '/4';
            }
            constant.cycleItems.map((q, i) => {
                if(q.dbformat == month) {
                    this.active = i;
                }
            });
            this.getIcs().then((res) => {
                if(res == "success") {
                    if(this.userIntercom.length > 3)
                    {
                    this.intercomArray = this.userIntercom.slice(this.userIntercom.length - 3, this.userIntercom.length);
                    } else if(this.userIntercom.length <= 3) {
                    this.intercomArray = this.userIntercom;
                    }
                }
            })
        },
        close() {
            this.show = false;
        },
        currentYear: function() {
            let today = new Date();
            let year = today.getFullYear();
            let currentYearIndex = this.yearArray.indexOf(year);

            this.selectedYear = currentYearIndex;
        },
        async getIcs(prop) {
            let allIcs;
            allIcs = {
                "ic_receiver" : this.userInfo.id,
                "ic_parent_type" : 10,
            }
            const res = await this.getIntercom(allIcs);
            return res;
        }, 
        inputIcDescription(e) {
            if(e === "")
            { 
                this.enableIcSubmitBtn = false;
            } else {
                this.enableIcSubmitBtn = true;
            }
        },
        displayIntercomListMore() {
          this.triple_down = !this.triple_down;
          if(this.triple_down == true)
          {
            this.intercomArray = this.userIntercom;
          } else {
            if(this.userIntercom.length > 3)
            {
              this.intercomArray = this.userIntercom.slice(this.userIntercom.length - 3, this.userIntercom.length);
            } else {
              this.intercomArray = this.userIntercom;
            }
          }
        },
        async handle_updateIntercom(prop) {
          let param = {
            ic_id : prop.ic_id,
            ic_thumbup : prop.ic_thumbup,
            ic_parent_type: 10,
          }
          const res = await this.updateIntercom(param);
          if(res == "success") {
            if(this.triple_down == true)
            {
              this.intercomArray = this.userIntercom;
            } else {
              if(this.userIntercom.length > 3)
              {
                this.intercomArray = this.userIntercom.slice(this.userIntercom.length - 3, this.userIntercom.length);
              } else {
                this.intercomArray = this.userIntercom;
              }
            }
          } 
        },
        async handle_deleteCertainIntercom(prop) {
          let param = {
            ic_id: prop.ic_id,
            ic_parent_type: 10,
          }
          const res = await this.deleteIntercom(param);
          if(res == "success") {
            if(this.triple_down == true)
            {
              this.intercomArray = this.userIntercom;
            } else {
              if(this.userIntercom.length > 3)
              {
                this.intercomArray = this.userIntercom.slice(this.userIntercom.length - 3, this.userIntercom.length);
              } else {
                this.intercomArray = this.userIntercom;
              }
            }
          } 
        },
        submitIcDescription() {
          let files = [];
          this.intercomFiles.forEach((f) => {
            files.push(f.file_id);
          });
          this.display_files = false;
          this.initFiles({type:"intercom"});   
          if(this.displayHiddenBtns == false)
          {
            let ic_add;
            if(!!this.userInfo) {
                ic_add = {
                    "ic_receiver": this.userInfo.id,
                    "ic_description": this.ic_desc,
                    "ic_parent_type": 10,
                    "ic_reply_ic": null,
                    "ic_thumbup": null,
                    "ic_uploaded_file": files.toString(),
                }
            }
            this.addIntercom(ic_add);
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
            this.triple_down = true;
            this.intercomArray = this.userIntercom;
          } else if(this.displayHiddenBtns == true)
          {
            let addReplyIc;
            if(!!this.userInfo) {
                addReplyIc = {
                    "ic_receiver": this.userInfo.id,
                    "ic_description": this.ic_desc,
                    "ic_parent_type": 10,
                    "ic_reply_ic": this.ic_reply_ic,
                    "ic_thumbup": null,
                    "ic_uploaded_file": files.toString(),
                }
            }
            this.addIntercom(addReplyIc);
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
            this.triple_down = true;
            this.intercomArray = this.userIntercom;
          }
        },
        handle_displayBtns(prop) {
          this.displayHiddenBtns = prop.displayReplyWindow;
          this.ic_sender = prop.sender_id;
          this.ic_reply_ic = prop.ic_reply_ic;
        },
        hideBtns() {
          this.displayHiddenBtns = false;
        },
        pickUser(param) {
          this.ic_desc += "@[" + param.user.user_post_address + "]";
          this.enableIcSubmitBtn = true;
        },
        allMembers() {
          this.ic_desc += "@[所有同事:all_members]"; 
        },
        handle_inputEmoji(e) {
          this.ic_desc += e;
          this.$refs.intercomDescription.focus();
        },
        fileInput() {
          this.$refs.fileIntercom.click();
        },
        clickIcInput() {
          this.$refs.intercomDescription.focus();
        },
        setFileForIntercom(e) {
          this.display_files = true;
          this.file = e.target.files[0];
          var formData = new FormData();
          formData.append("files", this.file);
          this.fileUpload({type: "intercom", value: formData});
        },
        removeFile(id) {
          this.deleteFileUploadById({ type:"intercom", file_id: id });
        },
    }
}
</script>

<style>
.okr_user_right_editor {
    height:calc(100% - 40px) !important;
    padding: 0px 0px 0px 10px;
    position:fixed;
    top:40px !important;
    right:0px;
}
.w100 {
    width: 100%;
}
.m_0 {
    margin: 0px;
}
.okr_user_close {
    color:rgb(102, 117, 128) !important;
}
.okr_user_close:hover {
    color: red !important;
}
.user_name {
    margin-left: 10px;
    font-size: 18px;
    color: rgb(62, 72, 78);
}
.okr_user_info {
    padding: 0px 20px 10px;
}
.year_quarter {
    color: rgb(131, 137, 143);
    font-size: 18px;
    margin-left: 10px;
}
.comment {
    font-size:20px;
    font-weight:500;
    color: rgb(62, 72, 78);
}
.pt_20 {
    padding-top: 20px;
}
.reply:hover .user-intercom-message {
    color:rgb(40, 121, 255) !important;
}
.user-intercom-message {
    color: rgb(102, 117, 127) !important;
    font-size: 15px !important;
    cursor:pointer;
}
.reply:hover .user-intercom-reply {
    color:rgb(40, 121, 255) !important;
}
.user-intercom-reply {
    color: rgb(102, 117, 127) !important;
    font-size: 12px !important;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
    position: relative;
    bottom: 2px;
    margin-left: 3px;
    cursor:pointer;
}
.thumb:hover .user-intercom-thumb {
    color:rgb(40, 121, 255) !important;
}
.user-intercom-thumb {
    color: rgb(102, 117, 127) !important;
    font-size: 15px !important;
    position: relative;
    bottom: 2px;
    cursor:pointer;
}
.thumb:hover .user-intercom-thumb_setting {
    color:rgb(40, 121, 255) !important;
}
.user-intercom-thumb_setting {
    color: rgb(102, 117, 127) !important;
    font-size: 12px !important;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
    position: relative;
    bottom: 2px;
    margin-left: 3px;
    cursor:pointer;
}
.cursorPointer {
  cursor:pointer; 
}
.progress_bottom {
  width: 100%;
}
.progress_bottom_down {
  width: 100% !important;
}
.progress_bottom_down_btn {
  font-size: 12px !important;
  color: rgb(143, 156, 166);
}
.progress_bottom_down:hover .progress_bottom_down_btn {
  color: blue !important;
}
.progress_bottom_down_btn:hover {
  color: red !important;
}
.progress_bottom_down_btn:hover .hide_btns {
  color: white !important;
  background-color: red !important;
}
.triple_down_icon {
  transition: all .3s ease;
}
.triple_down_icon_rotation {
  transform: rotate(180deg);
}
.progress_bottom-userInfo {
  background-color: rgb(250, 251, 252) !important;
}
.show_editBtns {
  width: 100%;
  height: 26px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}
.hided_editBtns {
  opacity: 0;
  width: 100%;
  height: 0px;
}
.hided_layout {
  padding: 0px 10px !important;
}
.progress_bottom-layout {
  padding: 5px;
}
.file_input {
  box-shadow: none;
  background-color: white !important;
  cursor:pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 1px !important;
  font-size: 13px;
  line-height: 20px;
  color: rgb(86, 94, 102);
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
}
.file_input:hover {
  background-color: rgb(255, 255, 255) !important;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 2px !important;
}
.file_input .mdi-paperclip {
  font-size: 17px !important;
}
.displayFlex_Interactive_Bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ic_bottomBtn {
    width: 45px;
}
.sms {
  margin: 0px !important;
  padding: 0px !important;
  width: 100%;
}
.sms label {
  color: rgb(131, 137, 143) !important;
  font-size: 14px !important;
}
.sms .v-icon {
  font-size: 18px !important;
}
.sms .v-input--selection-controls__ripple {
  border-radius: 50%;
  cursor: pointer;
  height: 17px;
  position: absolute;
  transition: inherit;
  width: 17px;
  left: -3px;
  top: calc(50% - 16px);
  margin: 7px;
}
.sms .v-input--selection-controls__input {
  margin-right: 0px !important;
}
.files_mt_10 {
  margin-top: 10px;
}
.files_mt_15 {
  margin-top: 15px;
  padding: 8px 5px;
  background-color: rgb(245, 248, 250);
}
.files_mt_15:hover .file_remove {
  opacity: 1;
}
.file_remove {
  transition: all ease .5s;
  opacity: 0;
}
.file_remove_close:hover {
  color: red !important;
}
</style>