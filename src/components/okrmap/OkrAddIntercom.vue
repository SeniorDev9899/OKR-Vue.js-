<template>
    <v-sheet class="add_intercom_ob">
        <v-sheet v-if="inputWindow" class="pt_15 bottomNavigationFlex_input ob_add_intercom h_208">
            
            <v-layout d-flex align-center justify-start row class="width100 m_0">
                <v-flex v-if="interactive" grow :class="displayHiddenBtns ? 'show_editBtns_detail' : 'hided_editBtns_detail'" style="transition: all .5s ease;">
                    <v-container style="height: 100%;">
                    <v-layout align-center justify-start row class="hided_layout">
                        <v-flex shrink class="progress_bottom_down_btn" style="margin-right: 20px;">回复</v-flex>
                        <v-flex grow class="progress_bottom_down_btn" @click="hideBtns">
                        {{ user_name }}
                        <v-icon class="hide_btns">
                            mdi-close-circle-outline
                        </v-icon>
                        </v-flex>
                    </v-layout>
                    </v-container>
                </v-flex>       
                <v-flex shrink :class="interactive ? '' : 'width100'">
                    <v-layout class="width100 m_0"><v-flex d-flex align-center justify-end class="width100 m_0"><v-icon class="close_intercom_input" @click="closeInputWindow">mdi-close-circle</v-icon></v-flex></v-layout>
                </v-flex>   
            </v-layout>

            <v-form class = "w100">

                <v-flex class="progress_bottom">
                    <v-textarea
                        ref="intercom" 
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

                <v-flex class="progress_bottom pt_0 justify-start" style="background-color:white;">
                    <v-layout align-center justify-start row class="w100 progress_bottom-layout m_0">
                      <v-flex class="task_mr_5">
                          <span class="w100 d-flex align-center justify-center">
                              <span @click="fileInput" class="file_input w100"><v-icon>mdi-paperclip</v-icon><span style="font-size:14px;">附件</span></span>
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
                        <span class="file_input w100" @click="allMembers">
                            <span>@ 所有同事</span>
                        </span>
                    </v-flex>
                    <v-flex class="btn_2 ic_bottomBtn task_mr_5">
                        <!-- <span class="icons emoji_picker"> -->
                            <EmojiPicker @inputEmoji="handle_inputEmoji" />
                        <!-- </span> -->
                    </v-flex>
                    <!-- <v-flex d-flex align-center justify-start grow class="btn_2 height_35 task_mr_5" >
                        <v-btn class="file_input p_0_5">
                            <v-checkbox class="sms" v-model="sms" label="短信通知" hide-details></v-checkbox>
                        </v-btn>
                    </v-flex> -->
                    <v-flex class = "btn ml_5" style="display:flex;align-items:center;justify-content:center;">
                        <v-btn
                            color = "primary" 
                            :disabled = "enableIcSubmitBtn ? false : true"
                            @click = "submitIcDescription"
                            style="padding:6px 3px;"
                        >回复</v-btn>
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
                </v-flex>
            </v-form>
        </v-sheet>
        <v-sheet v-else class="ptr_60 bottomNavigationFlex width100 ob_add_intercom">
            <v-btn class="bnBtn width100 ob_intercom_add" @click="displayInputWindow">
                <span class="bnBtn">需要沟通</span>
                <v-icon class="mr_5">mdi-pencil</v-icon>
            </v-btn>
        </v-sheet>
    </v-sheet>
</template>

<script>
import UserPicker from '@/components/common/UserPicker.vue';
import EmojiPicker from '@/components/common/EmojiPicker.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['object_id', 'tab_index', 'interactiveIcReplyIc'],
    data() {
        return {
            id: "",
            inputWindow: false,
            displayHiddenBtns: false,
            user_name: "",
            enableIcSubmitBtn: false,
            display_files: false,
            file: null,
            ic_desc: "",
            ic_reply_ic: "",
            interactive: false,
        }
    },
    created() {
        this.id = this.authUser.id;
        let userName = this.authUser.employeeName.split("_");
        userName.forEach((name, index) => {
          this.user_name = name.slice(0, 2).toUpperCase();
        });
        this.interactive = false;
        this.initFiles({type:"intercom"});    
    },
    watch: {
      object_id(v) {
        this.initFiles({type:"intercom"}); 
      },
      tab_index(v) {
        if(v == 3) {
          this.inputWindow = true;
          this.displayHiddenBtns = false;
          this.interactive = true;
        } else {
          this.inputWindow = false;
          this.interactive = false;
        }
      },
      interactiveIcReplyIc(v) {
        this.displayHiddenBtns = v.displayReplyWindow;
        this.ic_reply_ic = v.ic_reply_ic;
        this.inputWindow = true;
      }
    },
    components: {
        UserPicker,
        EmojiPicker,
    },
    computed: {
        ...mapGetters('auth', ['authUser']),  
        ...mapGetters('fileUpload', ['intercomFiles']),
    },
    methods: {
        ...mapActions('intercom', ['getIntercom', 'addIntercom', 'updateIntercom', 'deleteIntercom']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        displayInputWindow() {
          this.inputWindow = true;
          this.$emit('openInputWindow');
        },
        hideBtns() {
          this.displayHiddenBtns = false;
        },
        inputIcDescription(e) {
            if(e === "")
            { 
                this.enableIcSubmitBtn = false;
            } else {
                this.enableIcSubmitBtn = true;
            }
        },
        removeFile(id) {
          this.deleteFileUploadById({ type:"intercom", file_id: id });
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
        pickUser(param) {
          this.ic_desc += "@[" + param.user.user_post_address + "]";
          this.enableIcSubmitBtn = true;
        },
        allMembers() {
          this.ic_desc += "@[所有同事:all_members]"; 
        },
        handle_inputEmoji(e) {
          this.ic_desc += e;
          this.$refs.intercom.focus();
        },
        closeInputWindow() {
          this.inputWindow = false;
          this.$emit("closeInputWindow");
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
            let ic_add = {
                "ic_description": this.ic_desc,
                "ic_parent_type": 0,
                "ic_parent": this.object_id,
                "ic_reply_ic": null,
                "ic_thumbup": null,
                "ic_uploaded_file": files.toString(),
            }
            this.addIntercom(ic_add);
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
          } else if(this.displayHiddenBtns == true)
          {
            let addReplyIc = {
              "ic_description": this.ic_desc,
              "ic_parent_type": 0,
              "ic_parent": this.object_id,
              "ic_reply_ic": this.ic_reply_ic,
              "ic_thumbup": null,
              "ic_uploaded_file": files.toString(),
            }
            this.addIntercom(addReplyIc);
            this.ic_desc = "";
            this.inputIcDescription(this.ic_desc);
          }
          this.inputWindow = false;
          this.$emit("addNewIntercom");
        },
    }
}
</script>

<style scopped>
.add_intercom_ob {
    position:fixed;
    bottom:0px;
    width:100%;
}
.ob_intercom_add {
  max-width: 1500px !important;
  width: 100%
}
.bnBtn {
    color: #a4acb9 !important;
    font-size: 14px !important;
}
.mr_5 {
    margin-right: 5px !important;
    color: #a4acb9 !important;
    font-size: 18px !important;
}
.close_intercom_input {
  font-size: 15px !important;
  margin-bottom: 5px;
  margin-right: 5px;
  color: rgb(212 224 224);
}
.close_intercom_input:hover {
  color: rgb(218 45 117); 
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
.task_mr_5 {
  margin-right: 5px;
}
.ob_add_intercom {
  background: #fff;
  box-shadow: 0 -2px 8px 0 rgb(127 145 180 / 15%) !important;
  padding: 9px 9px 3px;
  z-index: 11;
}
.show_editBtns_detail {
  height: 26px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}
.hided_editBtns_detail {
  opacity: 0;
  height: 0px;
}
</style>