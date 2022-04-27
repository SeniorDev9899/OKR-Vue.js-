<template>
<v-card class="width100 h100 boxShadowRev p_0" d-flex align-start justify-start row>
    <v-flex v-if="intercomArray.length !=0" align-center justify-start class="width100 mb_15">
        <v-layout align-center justify-start>
            <v-flex class="progress_bottom_down cursorPointer" @click="displayIntercomListMore">
                <span class="progress_bottom_down_btn">全部沟通 {{ objectIntercom.length }}</span>
                <v-icon class="progress_bottom_down_btn triple_down_icon" :class="triple_down ? 'triple_down_icon_rotation' : ''">mdi-chevron-triple-down</v-icon>
            </v-flex>
        </v-layout>
    </v-flex>
    <v-flex v-if="intercomArray.length !=0" class="intercomItem">
        <IntercomItem v-for="ic in intercomArray" :key="ic.ic_id" :ic_id="ic.ic_id" :files="ic.ic_files" :timestamp="ic.created_at" :value="ic" :user_name="user_name" @displayBtns="handle_displayBtns" @deleteCertainIntercom="handle_deleteCertainIntercom" @updateIntercom="handle_updateIntercom" />
    </v-flex>
    <v-sheet class="width100 m_0" v-if="goal == true">
        <v-bottom-navigation v-if="inputWindow" absolute color="white" hide-on-scroll horizontal class="pt_15 bottomNavigationFlex_input h_215">
            <v-layout d-flex align-center justify-start row class="width100 m_0">
                <v-flex grow :class="displayHiddenBtns ? 'show_editBtns_detail' : 'hided_editBtns_detail'" style="transition: all .5s ease;">
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
                <v-flex shrink>
                    <v-layout class="width100 m_0">
                        <v-flex d-flex align-center justify-end class="width100 m_0">
                            <v-icon class="close_intercom_input" @click="inputWindow=false">mdi-close-circle</v-icon>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>

            <v-form class="w100">

                <v-flex class="progress_bottom">
                    <v-textarea ref="intercom" background-color="white" filled auto-grow hide-details outlined v-model="ic_desc" @input="inputIcDescription">
                    </v-textarea>
                </v-flex>

                <v-card class="d-flex flex-row" flat>
                    <v-card class="d-flex pa-1 " flat>
                        <span @click="fileInput" class="file_input pa-3">
                            <v-icon>mdi-paperclip</v-icon><span>附件</span>
                        </span>
                        <input type="file" ref="file" style="display:none;" @change="setFileForIntercom">
                    </v-card>

                    <v-card class="d-flex pa-1 " flat>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on" class="file_input pa-3">
                                    <span>@ 同事</span>
                                </span>
                            </template>
                            <v-card>
                                <UserPicker @pick="pickUser" />
                            </v-card>
                        </v-menu>
                    </v-card>

                    <v-card class="d-flex pa-1 " flat>
                        <span class="file_input pa-3" @click="allMembers">
                            <span>@ 所有同事</span>
                        </span>
                    </v-card>

                    <v-card class="d-flex pa-1 " flat>
                        <EmojiPicker @inputEmoji="handle_inputEmoji" />
                    </v-card>

                    <v-card class="d-flex pa-1 " flat>
                        <v-btn  :disabled="enableIcSubmitBtn ? false : true" @click="submitIcDescription" class="intercom_submit pa-3" color="primary">回复</v-btn>
                    </v-card>
                </v-card>

                <!-- <v-flex class="progress_bottom pt_0" style="background-color:white;">
                    <v-layout justify-start class="progress_bottom-layout m_0">
                        <v-flex v-if="display_files && intercomFiles.length != 0" class="width100 files_mt_25">
                            <v-layout d-flex align-center justify-start row class="width100 m_0">
                                <v-flex v-for="(file, index) in intercomFiles" :key="index" d-flex align-center justify-start class="width100 files_mt_15">
                                    <v-layout d-flex align-center jsutify-start row class="width100 m_0">
                                        <v-flex shrink>
                                            <v-icon color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon>
                                        </v-flex>
                                        <v-flex d-flex align-center justify-start grow><span style="color:rgb(100, 116, 129);">{{ file.file_name.split(".")[0] }}</span></v-flex>
                                        <v-flex shrink><span style="color:rgb(45, 171, 146);margin-right:10px;font-size:12px;">文件上传成功</span></v-flex>
                                        <v-flex shrink class="file_remove">
                                            <v-icon size="15" color="rgb(169, 184, 191)" style="cursor:pointer;" class="file_remove_close" @click="removeFile(file.file_id)">mdi-close-circle</v-icon>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex> -->
            </v-form>
        </v-bottom-navigation>
        
        <v-bottom-navigation v-else absolute color="white" hide-on-scroll horizontal scroll-threshold="500" class="ptr_60 bottomNavigationFlex width100">
            <v-btn class="h100 bnBtn width100 ob_intercom_add" @click="displayInputWindow">
                <span class="bnBtn">需要沟通</span>
                <v-icon class="mr_5">mdi-pencil</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-sheet>
</v-card>
</template>

<script>
import IntercomItem from '@/components/okrgoal/rightInfo/interactive/intercom/IntercomItem.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import EmojiPicker from '@/components/common/EmojiPicker.vue';
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    props: ['object_id', 'goal'],
    components: {
        IntercomItem,
        UserPicker,
        EmojiPicker,
    },
    data() {
        return {
            id: "",
            inputWindow: true,
            enableIcSubmitBtn: false,
            ic_desc: "",
            displayHiddenBtns: false,
            triple_down: false,
            user_name: "",
            intercomArray: [],
            ic_reply_ic: "",
            file: null,
            sms: false,
            display_files: false,
        }
    },
    created() {
        let userName = this.authUser.employeeName.split("_");
        userName.forEach((name, index) => {
            this.user_name = name.slice(0, 2).toUpperCase();
        });
        this.id = this.authUser.id;
        this.getIcs(this.object_id).then((res) => {
            if (res == "success") {
                if (this.objectIntercom.length > 3) {
                    this.intercomArray = this.objectIntercom.slice(this.objectIntercom.length - 3, this.objectIntercom.length);
                } else if (this.intercomArray.length <= 3) {
                    this.intercomArray = this.objectIntercom;
                }
            }
        })
        this.initFiles({
            type: "intercom"
        });
        if (this.goal == true) {
            this.inputWindow = false;
        }
    },
    watch: {
        object_id(v) {
            this.initFiles({
                type: "intercom"
            });
            this.getIcs(v).then((res) => {
                if (res == "success") {
                    if (this.objectIntercom.length > 3) {
                        this.intercomArray = this.objectIntercom.slice(this.objectIntercom.length - 3, this.objectIntercom.length);
                    } else if (this.intercomArray.length <= 3) {
                        this.intercomArray = this.objectIntercom;
                    }
                }
            })
        },
        goal(v) {
            if (v == true) {
                this.inputWindow = false;
            } else {
                this.inputWindow = true;
            }
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('intercom', ['objectIntercom']),
        ...mapGetters('fileUpload', ['intercomFiles']),
    },
    methods: {
        ...mapActions('intercom', ['getIntercom', 'addIntercom', 'updateIntercom', 'deleteIntercom']),
        ...mapActions('fileUpload', ['initFiles', 'fileUpload', 'deleteFileUploadById']),
        displayInputWindow() {
            this.inputWindow = true;
        },
        inputIcDescription(e) {
            if (e === "") {
                this.enableIcSubmitBtn = false;
            } else {
                this.enableIcSubmitBtn = true;
            }
        },
        hideBtns() {
            this.displayHiddenBtns = false;
        },
        displayIntercomListMore() {
            this.triple_down = !this.triple_down;
            if (this.triple_down == true) {
                this.intercomArray = this.objectIntercom;
            } else {
                if (this.objectIntercom.length > 3) {
                    this.intercomArray = this.objectIntercom.slice(this.objectIntercom.length - 3, this.objectIntercom.length);
                } else {
                    this.intercomArray = this.objectIntercom;
                }
            }
        },
        handle_displayBtns(prop) {
            this.displayHiddenBtns = prop.displayReplyWindow;
            this.ic_reply_ic = prop.ic_reply_ic;
            this.inputWindow = true;
            this.$emit("displayHiddenBtns", prop);
        },
        async handle_updateIntercom(prop) {
            let param = {
                ic_id: prop.ic_id,
                ic_thumbup: prop.ic_thumbup,
                ic_parent_type: 0,
            }
            const res = await this.updateIntercom(param);
            if (res == "success") {
                if (this.triple_down == true) {
                    this.intercomArray = this.objectIntercom;
                } else {
                    if (this.objectIntercom.length > 3) {
                        this.intercomArray = this.objectIntercom.slice(this.objectIntercom.length - 3, this.objectIntercom.length);
                    } else {
                        this.intercomArray = this.objectIntercom;
                    }
                }
            }
        },
        async handle_deleteCertainIntercom(prop) {
            let param = {
                ic_id: prop.ic_id,
                ic_parent_type: 0,
            }
            const res = await this.deleteIntercom(param);
            if (res == "success") {
                if (this.triple_down == true) {
                    this.intercomArray = this.objectIntercom;
                } else {
                    if (this.objectIntercom.length > 3) {
                        this.intercomArray = this.objectIntercom.slice(this.objectIntercom.length - 3, this.objectIntercom.length);
                    } else {
                        this.intercomArray = this.objectIntercom;
                    }
                }
            }
        },
        setFileForIntercom(e) {
            this.display_files = true;
            this.file = e.target.files[0];
            var formData = new FormData();
            formData.append("files", this.file);
            this.fileUpload({
                type: "intercom",
                value: formData
            });
        },
        removeFile(id) {
            this.deleteFileUploadById({
                type: "intercom",
                file_id: id
            });
        },
        fileInput() {
            this.$refs.file.click();
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
        async getIcs(prop) {
            let allIcs = {
                "ic_parent": prop,
                "ic_parent_type": 0,
            }
            const res = await this.getIntercom(allIcs);
            return res;
        },
        submitIcDescription() {
            let files = [];
            this.intercomFiles.forEach((f) => {
                files.push(f.file_id);
            });
            this.display_files = false;
            this.initFiles({
                type: "intercom"
            });
            if (this.displayHiddenBtns == false) {
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
                this.triple_down = true;
                this.intercomArray = this.objectIntercom;
            } else if (this.displayHiddenBtns == true) {
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
                this.triple_down = true;
                this.intercomArray = this.objectIntercom;
            }
            this.inputWindow = false;
        },
    }
}
</script>

<style scoped>
.width100 {
    width: 100%;
}

.pt_50 {
    padding-top: 50px;
}

.pb_75 {
    padding-bottom: 75px;
}

.pt_0 {
    padding-top: 0px;
}

.h100 {
    height: 100% !important;
}

.h60 {
    height: 60% !important;
}

.thumb_area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 16px 0 11px;
    box-sizing: border-box;
    width: 108px;
    height: 56px;
    background: rgba(40, 121, 255, .1);
    border-radius: 28px;
    margin-bottom: 16px;
    cursor: pointer;
}

.thumb {
    display: inline-block;
    color: #2879ff;
    height: 20px;
    font-size: 20px !important;
    font-weight: 600;
    position: relative;
    bottom: 8px;
}

.thumbIcon {
    color: #2879ff !important;
    font-size: 22px !important;
}

.count {
    display: inline-block;
    height: 20px;
    font-size: 17px;
    font-family: -apple-system, Arial, Verdana, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 400;
    color: #2879ff;
    line-height: 20px;
}

.boxShadowRev {
    box-shadow: none !important;
}

.pt_15 {
    padding: 15px 6px 6px 6px;
}

.bottomNavigationFlex {
    display: flex;
    align-items: center;
    justify-content: center;
}

.bottomNavigationFlex_input {
    display: inline-block !important;
    align-items: center;
}

.h_215 {
    height: 215px !important;
}

.h_242 {
    height: 235px !important;
}

.mr_5 {
    margin-right: 5px !important;
    color: #a4acb9 !important;
    font-size: 18px !important;
}

.bnBtn {
    color: #a4acb9 !important;
    font-size: 14px !important;
}

.fontFamily {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei;
}

.progress_bottom-layout {
    width: 100%;
    margin: 0px;
    padding: 0px;
    padding-top: 13px;
}

.btn_2 {
    color: rgb(131, 137, 143) !important;
    font-size: 14px !important;
}

.ic_bottomBtn {
    width: 65px;
}

.btn_2_b {
    padding: 0px !important;
    box-shadow: none !important;
    cursor: pointer;
}

.btn_2-icons {
    font-size: 17px !important;
    margin-right: 5px;
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

.hided_layout {
    padding: 0px 10px !important;
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

.hide_btns {
    font-size: 14px !important;
    background-color: red;
    border-radius: 50%;
    color: white !important;
    cursor: pointer;
}

.progress_bottom_down_btn:hover .hide_btns {
    color: white !important;
    background-color: red !important;
}

.cursorPointer {
    cursor: pointer;
}

.triple_down_icon {
    transition: all .3s ease;
}

.triple_down_icon_rotation {
    transform: rotate(180deg);
}

.mb_15 {
    margin-bottom: 15px;
}

.p_0_10 {
    padding: 0px 10px;
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
    width: 100%;
    margin: 0px !important;
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

.object_all_members {
    width: 85px;
}

.object_all_members .icons {
    width: 100%;
    padding: 5px 5px !important;
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

.displayFlex_object_intercom {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.file_input .mdi-paperclip {
    font-size: 17px !important;
}

.p_0_5 {
    padding: 0px 5px !important;
}

.displayFlex_Interactive_Bottom {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.h50 {
    height: 50% !important;
}

.pt_15 {
    padding-top: 15px;
}

.p_0 {
    padding: 0px !important;
}

.height_35 {
    height: 35px;
}

.task_mr_5 {
    margin-right: 5px;
}

.close_intercom_input {
    font-size: 15px;
    margin-bottom: 5px;
    margin-right: 5px;
    color: rgb(212 224 224);
}

.close_intercom_input:hover {
    color: rgb(218 45 117);
}

.ob_intercom_add {
    max-width: 1500px !important;
    width: 100%
}
.intercom_submit{
    box-shadow: none;
    background-color: rgb(40, 121, 255) !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    line-height: 20px;
}
.file_input {
    box-shadow: none;
    background-color: white !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    line-height: 20px;
    color: rgb(86, 94, 102);
}

.file_input:hover {
    background-color: rgb(255, 255, 255) !important;
    box-shadow: rgb(0 0 0 / 30%) 0px 1px 2px !important;
}
</style>
