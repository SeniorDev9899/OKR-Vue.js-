<template>
<v-sheet class = "w100">
    <v-layout align-center justify-start column>

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
                <span class="progress_bottom_down_btn">全部沟通 {{ intercom.length }}</span>
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
</v-sheet>
</template>

<script>
import IntercomItem from './IntercomItem.vue';
import EmojiPicker from '@/components/common/EmojiPicker.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
    props: ['kr_id'],
    components: {
      IntercomItem,
      UserPicker,
      EmojiPicker,
    },
    data() {
        return {
            ic_desc: "",
            enableIcSubmitBtn : false,
            userId: null,
            displayHiddenBtns: false,
            triple_down: false,
            ic_reply_ic: "",
            intercomArray: [],
            user_name: "",
            id: "",
            sms: false,
            file: null,
            menu: false,
            display_files: false,
            ic_sender: null,
        }
    },
    computed: {
      ...mapGetters('auth', ['authUser']),
      ...mapGetters('intercom', ['intercom']),
      ...mapGetters('fileUpload', ['intercomFiles']),
    },
    created() {
      let userName = this.authUser.employeeName.split("_");
      userName.forEach((name, index) => {
        this.user_name = name.slice(0, 2).toUpperCase();
      });
      // userName[0] = userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
      // userName[1] = userName[1].charAt(0).toUpperCase() + userName[1].slice(1);
      // this.user_name = userName[0] + " " + userName[1];
      this.id = this.authUser.id;
      if(!!this.kr_id)
      {
        this.getIcs({ mode: "kr", id: this.kr_id }).then((res) => {
          if(res == "success") {
            if(this.intercom.length > 3)
            {
              this.intercomArray = this.intercom.slice(this.intercom.length - 3, this.intercom.length);
            } else if(this.intercom.length <= 3) {
              this.intercomArray = this.intercom;
            }
          }
        })
      }
      this.initFiles({type:"intercom"});    
    },
    methods: {
        ...mapActions('intercom', ['getIntercom', 'addIntercom', 'deleteIntercom', 'updateIntercom']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        inputIcDescription(e) {
            if(e === "")
            { 
                this.enableIcSubmitBtn = false;
            } else {
                this.enableIcSubmitBtn = true;
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
            if(!!this.kr_id) 
            {
              ic_add = {
                "ic_description": this.ic_desc,
                "ic_parent_type": 1,
                "ic_parent": this.kr_id,
                "ic_reply_ic": null,
                "ic_thumbup": null,
                "ic_uploaded_file": files.toString(),
               }
            }
            this.addIntercom(ic_add);
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
            this.triple_down = true;
            this.intercomArray = this.intercom;
          } else if(this.displayHiddenBtns == true)
          {
            let addReplyIc;
            if(!!this.kr_id)
            {
              addReplyIc = {
                "ic_description": this.ic_desc,
                "ic_parent_type": 1,
                "ic_parent": this.kr_id,
                "ic_reply_ic": this.ic_reply_ic,
                "ic_thumbup": null,
                "ic_uploaded_file": files.toString(),
               }
            }
            this.addIntercom(addReplyIc);
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
            this.triple_down = true;
            this.intercomArray = this.intercom;
          }
        },
        async handle_updateIntercom(prop) {
          let param = {
            ic_id : prop.ic_id,
            ic_thumbup : prop.ic_thumbup,
            ic_parent_type: 1,
          }
          const res = await this.updateIntercom(param);
          if(res == "success") {
            if(this.triple_down == true)
            {
              this.intercomArray = this.intercom;
            } else {
              if(this.intercom.length > 3)
              {
                this.intercomArray = this.intercom.slice(this.intercom.length - 3, this.intercom.length);
              } else {
                this.intercomArray = this.intercom;
              }
            }
          } else if(res == "Error") {
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
        async handle_deleteCertainIntercom(prop) {
          let param = {
            ic_id: prop.ic_id,
            ic_parent_type: 1,
          }
          const res = await this.deleteIntercom(param);
          if(res == "success") {
            if(this.triple_down == true)
            {
              this.intercomArray = this.intercom;
            } else {
              if(this.intercom.length > 3)
              {
                this.intercomArray = this.intercom.slice(this.intercom.length - 3, this.intercom.length);
              } else {
                this.intercomArray = this.intercom;
              }
            }
          } else if(res == "Error") {
          }
        },
        displayIntercomListMore() {
          this.triple_down = !this.triple_down;
          if(this.triple_down == true)
          {
            this.intercomArray = this.intercom;
          } else {
            if(this.intercom.length > 3)
            {
              this.intercomArray = this.intercom.slice(this.intercom.length - 3, this.intercom.length);
            } else {
              this.intercomArray = this.intercom;
            }
          }
        },
        async getIcs(prop) {
          let allIcs;
          if(prop.mode == "kr")
          {
            allIcs = {
              "ic_parent" : prop.id,
              "ic_parent_type" : 1,
            }
          }         
          const res = await this.getIntercom(allIcs);
          return res;
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
        pickUser(param) {
          this.ic_desc += "@[" + param.user.user_post_address + "]";
          this.enableIcSubmitBtn = true;
        },
        allMembers() {
          this.ic_desc += "@[所有同事:all_members]"; 
        },
        selectEmoji(prop) {
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
        }
    }
}
</script>

<style>
.progress_bottom_btns {
  width: 100%;
}
.progress_bottom_message {
  font-size: 15px !important;
  color: rgb(102, 117, 127);
}
.progress_bottom_reply {
  font-size: 12px;
  color: rgb(102, 117, 127);
}
.progress_bottom_vertical_divider {
  margin-right: 5px;
  margin-left: 5px;
}
.progress_bottom_thumb {
  font-size: 15px !important;
  color: rgb(102, 117, 127);
  margin-right: 7px;
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
.triple_down_icon {
  transition: all .3s ease;
}
.triple_down_icon_rotation {
  transform: rotate(180deg);
}
.progress_bottom-userInfo {
  background-color: rgb(250, 251, 252) !important;
}
.progress_bottom-userInfo-flex {
  transition: all .5s ease;
}
.progress_bottom_userInfo_layout {
  padding: 20px;
}
.progress_bottom_userInfo_flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;
}
.btn_1 {
  color: rgb(58, 66, 71);
  font-size: 12px;
}
.btn_2 {
  color: rgb(131, 137, 143) !important;
  font-size: 14px !important;
}
#progress_bottom_edit {
  height: 20px;
}
.editBtns {
  margin-right: 5px;
  color: #8888ea !important;
  opacity: 0;
  transition: all .5s ease;
  cursor: pointer !important;
}
.progress_bottom-userInfo-flex:hover .editBtns {
  opacity: 1;
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
.progress_bottom_down_btn:hover {
  color: red !important;
}
.progress_bottom_down_btn:hover .hide_btns {
  color: white !important;
  background-color: red !important;
}
.hide_btns {
  font-size: 14px !important;
  background-color: rgb(171 194 205);
  border-radius: 50%;
  color: white !important;
  cursor: pointer;
}
.progress_bottom-layout {
  padding: 5px;
}
.btn_2_b {
  padding: 0px !important;
  box-shadow: none !important;
  cursor: pointer;
}
.btn_2-icons {
  font-size: 17px !important;
  margin-right: 3px;
}
.progress_bottom-userInfo-flex:hover {
  background-color: rgb(234 242 250);
}
.w100 {
    width: 100%;
}
.ic_bottomBtn {
    width: 45px;
}
.mt_10 {
  margin-top: 8px;
}
.cursorPointer {
  cursor:pointer; 
}
.bottom_meg:hover .progress_bottom_message {
  color: rgb(74 118 220) !important;
  cursor: pointer;
}
.bottom_meg:hover .progress_bottom_reply {
  color: rgb(74 118 220) !important;
  cursor: pointer;
}
.bottom_thumb:hover .progress_bottom_thumb {
  color: rgb(74 118 220) !important;
  cursor: pointer;
}
.bottom_thumb:hover .progress_bottom_reply {
  color: rgb(74 118 220) !important;
  cursor: pointer;
}
.object_interactive_thumb {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
.displayFlex_Interactive_Bottom {
  display: flex;
  align-items: center;
  justify-content: center;
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
.ml_5 {
  margin-left: 5px;
}
.wrapper {
  position: relative;
  display: inline-block;
}

.regular-input {
  padding: 0.5rem 1rem;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 20rem;
  height: 12rem;
  outline: none;
}

.regular-input:focus {
  box-shadow: 0 0 0 3px rgba(66,153,225,.5);
}

.emoji-invoker {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: #b1c6d0;
}

.emoji-picker {
  position: absolute;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
.file_upload {
  width: 100%;
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
.file_input .mdi-paperclip {
  font-size: 17px !important;
}
.intercom_file-upload {
  padding: 0px;
  margin: 0px;
}
.intercom_file-upload .v-input__prepend-outer {
  width: 100%;
  margin: 0px !important;
}
.intercom_file-upload .v-icon {
  font-size: 20px !important;
}
.intercom_file-upload .mdi-paperclip {
  font-size: 15px !important;
}
.files_mt_25 {
  margin-top: 30px;
}
.files_mt_15 {
  margin-top: 15px;
  padding: 8px 5px;
  background-color: rgb(245, 248, 250);
}
.file_remove {
  transition: all ease .5s;
  opacity: 0;
}
.files_mt_15:hover .file_remove {
  opacity: 1;
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
.p_0_5 {
  padding: 0px 5px !important;
}
</style>