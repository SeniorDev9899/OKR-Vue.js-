<template>
<v-container d-flex class="w100">
    <v-layout align-center justify-center column class="w100 m_0">

        <v-flex d-flex align-center justify-end class="progress_bottom_btns">
          <span class = "bottom_meg" @click="clickIcInput">
              <v-icon class="progress_bottom_message" style = "margin-top: 3px;">
                mdi-message-text-outline
              </v-icon>
              <span class="progress_bottom_reply">回复</span>
          </span>
          <span class="progress_bottom_vertical_divider">|</span>
          <span class = "bottom_thumb">
              <v-icon class="progress_bottom_thumb">
                mdi-thumb-up-outline
              </v-icon>
              <span class="progress_bottom_reply">点赞</span>
          </span>
        </v-flex>

        <v-flex align-center justify-start class="progress_bottom">
            <v-layout align-center justify-start>
                <v-flex class="progress_bottom_down cursorPointer" @click = "displayIntercomListMore">
                    <span class="progress_bottom_down_btn">全部沟通 {{ reportIntercom.length }}</span>
                    <v-icon class="progress_bottom_down_btn triple_down_icon" :class = "triple_down ? 'triple_down_icon_rotation' : ''">mdi-chevron-triple-down</v-icon>
                </v-flex>
            </v-layout>
        </v-flex>
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
                    :user_name = "user_name"
                    @displayBtns = "handle_displayBtns"
                    @deleteCertainIntercom = "handle_deleteCertainIntercom"
                    @updateIntercom = "handle_updateIntercom"
                />

                <v-flex class="progress_bottom" :class="displayHiddenBtns ? 'show_editBtns' : 'hided_editBtns'" style="transition: all .5s ease;">
                    <v-container style="height: 100%;">
                        <v-layout align-center justify-start row class="hided_layout">
                        <v-flex shrink class="progress_bottom_down_btn" style="margin-right: 20px;">回复</v-flex>
                        <v-flex class="progress_bottom_down_btn" @click="hideBtns">
                            {{ user_name }}
                            <v-icon class="hide_btns">
                            mdi-close-circle-outline
                            </v-icon>
                        </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
                
                <v-form class = "w100">

                    <v-flex class="progress_bottom">
                        <v-textarea
                            ref="intercom"
                            background-color="white" 
                            filled
                            auto-grow
                            hide-details
                            outlined
                            v-model = "summaryIntercom_desc"
                            @input = "inputSummaryIntercom"
                        >
                        </v-textarea>
                    </v-flex>

                    <v-flex class="progress_bottom" style="background-color:white;">
                      <v-layout align-center justify-start row class="w100 progress_bottom-layout m_0">
                        <v-flex class="task_mr_5">
                            <span class="w100 d-flex align-center justify-center">
                              <span @click="fileInput" class="file_input p_0_5 w100"><v-icon>mdi-paperclip</v-icon><span style="font-size:14px;">附件</span></span>
                              <input type="file" ref="file" style="display:none;" @change="setFileForIntercom">
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
                            <v-btn class="file_input w100" @click="allMembers">
                                  <span>@ 所有同事</span>
                            </v-btn>
                        </v-flex>
                        <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom task_mr_5">
                            <!-- <span class="btn_2_b icons emoji_picker"> -->
                              <EmojiPicker @inputEmoji="handle_inputEmoji" />
                            <!-- </span> -->
                        </v-flex>
                        <v-flex class="btn_2 ic_bottomBtn displayFlex_Interactive_Bottom ">
                            <span class="file_input w100">
                                <v-checkbox class="sms" v-model="sms" label="短信通知" hide-details></v-checkbox>
                            </span>
                        </v-flex>
                        <v-flex class = "btn ic_bottomBtn displayFlex_Interactive_Bottom ml_5">
                            <v-btn 
                                color = "primary" 
                                :disabled = "enableSubmitBtn ? false : true"
                                @click = "submitSummaryIntercom"
                            >回复</v-btn>
                        </v-flex>
                        </v-layout>
                    </v-flex>
                </v-form>
            </v-layout>
        </v-flex>
        <v-flex v-if="display_files && intercomFiles.length != 0" class="width100 files_mt_25">
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
</template>

<script>
import IntercomItem from '@/components/summary/SummaryIntercomItem.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import EmojiPicker from '@/components/common/EmojiPicker.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['info', 'type'],
    data() {
        return {
            id: "",
            summaryIntercom_desc: "",
            enableSubmitBtn : false,
            sms: false,
            displayHiddenBtns: false,
            user_name: "",
            intercomArray: [],
            ic_reply_ic: "",
            triple_down: false,
            files: [],
            file: null,
            display_files: false,
        }
    },
    created() {
        let userName = this.authUser.employeeName.split("_");
        userName.forEach((name, index) => {
            this.user_name = name.slice(0, 2).toUpperCase();
        });
        this.id = this.authUser.id;
        if(!!this.info)
        {
          this.getIcs({ mode: "rp", id: this.info.rp_id }).then((res) => {
            if(res == "success") {
              if(this.reportIntercom.length > 3)
              {
                  this.intercomArray = this.reportIntercom.slice(this.reportIntercom.length - 3, this.reportIntercom.length);
              } else if(this.reportIntercom.length <= 3) {
                  this.intercomArray = this.reportIntercom;
              }
            }
          })
        }
        this.initFiles({type:"intercom"});  
    },
    components: {
        UserPicker,
        IntercomItem,
        EmojiPicker,
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('intercom', ['reportIntercom']),
        ...mapGetters('fileUpload', ['intercomFiles']),
    },
    methods: {
        ...mapActions('intercom', ['getIntercom', 'addIntercom', 'deleteIntercom', 'updateIntercom']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        inputSummaryIntercom(e) {
            if(e === "")
            { 
                this.enableSubmitBtn = false;
            } else {
                this.enableSubmitBtn = true;
            }
        },
        uploadFiles() {
        },
        pickUser(param) {
          this.summaryIntercom_desc += "@[" + param.user.user_post_address + "]";
          this.enableSubmitBtn = true;
        },
        allMembers() {
          this.summaryIntercom_desc += "@[所有同事:all_members]"; 
        },        
        handle_displayBtns(prop) {
          this.displayHiddenBtns = prop.displayReplyWindow;
          this.ic_reply_ic = prop.ic_reply_ic;
        },
        hideBtns() {
          this.displayHiddenBtns = false;
        },
        displayIntercomListMore() {
          this.triple_down = !this.triple_down;
          if(this.triple_down == true)
          {
            this.intercomArray = this.reportIntercom;
          } else {
            if(this.reportIntercom.length > 3)
            {
              this.intercomArray = this.reportIntercom.slice(this.reportIntercom.length - 3, this.reportIntercom.length);
            } else {
              this.intercomArray = this.reportIntercom;
            }
          }
        },
        async getIcs(prop) {
          let allIcs;
          if(prop.mode == "rp")
          {
            allIcs = {
              "ic_parent" : prop.id,
              "ic_parent_type" : 4,
            }
          }         
          const res = await this.getIntercom(allIcs);
          return res;
        }, 
        submitSummaryIntercom() {
          let files = [];
          this.intercomFiles.forEach((f) => {
            files.push(f.file_id);
          });
          this.display_files = false;
          this.initFiles({type:"intercom"});
          if(this.displayHiddenBtns == false)
          {
            let ic_add;
            if(!!this.info.rp_id) 
            {
              ic_add = {
                "ic_description": this.summaryIntercom_desc,
                "ic_parent_type": 4,
                "ic_parent": this.info.rp_id,
                "ic_reply_ic": null,
                "ic_thumbup": null,
                "ic_uploaded_file": files.toString(),
               }
            }
            this.addIntercom(ic_add);
            this.summaryIntercom_desc = "";
            this.inputSummaryIntercom(this.summaryIntercom_desc);
            this.triple_down = true;
            this.intercomArray = this.reportIntercom;
          } else if(this.displayHiddenBtns == true)
          {
            let addReplyIc;
            if(!!this.info.rp_id)
            {
                addReplyIc = {
                    "ic_description": this.summaryIntercom_desc,
                    "ic_parent_type": 4,
                    "ic_parent": this.info.rp_id,
                    "ic_reply_ic": this.ic_reply_ic,
                    "ic_thumbup": null,
                    "ic_uploaded_file": files.toString(),
                }
            }
            this.addIntercom(addReplyIc);
            this.summaryIntercom_desc = "";
            this.inputSummaryIntercom(this.summaryIntercom_desc);
            this.triple_down = true;
            this.intercomArray = this.reportIntercom;
          }
        },
        async handle_deleteCertainIntercom(prop) {
          let param = {
            ic_id: prop.ic_id,
            ic_parent_type: 4,
          }
          const res = await this.deleteIntercom(param);
          if(res == "success") {
            if(this.triple_down == true)
            {
              this.intercomArray = this.reportIntercom;
            } else {
              if(this.reportIntercom.length > 3)
              {
                this.intercomArray = this.reportIntercom.slice(this.reportIntercom.length - 3, this.reportIntercom.length);
              } else {
                this.intercomArray = this.reportIntercom;
              }
            }
          }
        },
        async handle_updateIntercom(prop) {
          let param = {
            ic_id : prop.ic_id,
            ic_thumbup : prop.ic_thumbup,
            ic_parent_type: 4,
          }
          const res = await this.updateIntercom(param);
          if(res == "success") {
            if(this.triple_down == true)
            {
              this.intercomArray = this.reportIntercom;
            } else {
              if(this.reportIntercom.length > 3)
              {
                this.intercomArray = this.reportIntercom.slice(this.reportIntercom.length - 3, this.reportIntercom.length);
              } else {
                this.intercomArray = this.reportIntercom;
              }
            }
          }
        },
        fileInput() {
          this.$refs.file.click();
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
        handle_inputEmoji(e) {
          this.summaryIntercom_desc += e;
          this.$refs.intercom.focus();
        },
        clickIcInput() {
          this.$refs.intercom.focus();
        }
    }
}
</script>

<style>
.p_0 {
    padding: 0px !important;
}
.m_0 {
    margin: 0px;
}
.w100 {
    width: 100%;
}
.progress_bottom {
  width: 100%;
}
.progress_bottom-layout {
  padding: 5px;
}
.btn_2 {
  color: rgb(131, 137, 143) !important;
  font-size: 14px !important;
}
.ic_bottomBtn {
    width: 45px;
}
.displayFlex_Interactive_Bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn_2_b {
  padding: 0px !important;
  box-shadow: none !important;
  cursor: pointer;
}
.icons {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  padding-left: 3px !important;
  padding-right: 3px !important;
  width: 100%;
  border-radius: 5px !important;
  background-color: rgb(250 251 252) !important;
}
.icons:hover {
  background-color: rgb(240, 240, 240) !important;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%) !important;
}
.btn_2-icons {
  font-size: 17px !important;
  margin-right: 5px;
}
.ml_5 {
  margin-left: 5px;
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
.hide_btns {
  font-size: 14px !important;
  background-color: rgb(171 194 205);
  border-radius: 50%;
  color: white !important;
  cursor: pointer;
}
.progress_bottom_down_btn:hover .hide_btns {
  color: white !important;
  background-color: red !important;
}
.progress_bottom-userInfo {
  background-color: rgb(250, 251, 252) !important;
}
.mt_10 {
  margin-top: 8px;
}
.cursorPointer {
  cursor:pointer; 
}
.triple_down_icon {
  transition: all .3s ease;
}
.triple_down_icon_rotation {
  transform: rotate(180deg);
}
.file_upload {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 3px !important;
  box-shadow: none !important;
}
.file_upload:hover {
  border-radius: 2px !important;
  background-color: rgb(255, 255, 255) !important;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 2px !important;
}
.intercom_file-upload {
  padding: 0px;
  margin: 0px;
}
.intercom_file-upload .v-input__prepend-outer {
  margin: 0px !important;
}
.intercom_file-upload .v-icon {
  font-size: 20px !important;
}
.files_mt_25 {
  margin-top: 30px;
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
</style>