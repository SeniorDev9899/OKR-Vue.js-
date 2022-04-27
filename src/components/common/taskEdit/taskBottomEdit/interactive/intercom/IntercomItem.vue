<template>
<v-sheet class = "w100">
    <v-flex class="progress_bottom progress_bottom-userInfo-flex mb_40 background">
        <v-layout align-start justify-start row class="progress_bottom_userInfo_layout">
            <v-flex shrink>
                <v-avatar color="rgb(121, 199, 183)" size="26" style = "color: white; font-size: 12px;">{{ user_name.charAt(0) }}</v-avatar>
            </v-flex>
            <v-flex class="progress_bottom_userInfo_flex">
                <v-layout align-center justify-ceter column>
                    <v-flex class="progress_bottom btn_1">
                        {{ user_name }}
                        <span v-if = "value.ic_replys.length != 0" class = "reply" style = "font-weight: 70 !important;">回复</span>
                        <span v-if = "value.ic_replys.length != 0" class = "mr_3">{{ user_name }}</span>
                        <ToolTipComponent
                            v-if = "value.ic_replys.length != 0"
                            direction="top"
                            :tooltipText="value.ic_replys[0].ic_description"
                        >
                            <span v-if = "value.ic_replys.length != 0" class = "reply">的话 : </span> 
                        </ToolTipComponent>
                    </v-flex>

                    <v-flex class="progress_bottom btn_2 multi-line">
                        {{ value.ic_description }}
                        <v-layout d-flex align-center justify-start column class="width100 m_0">
                            <v-flex d-flex align-center justify-start class="width100" v-if="files.length != 0" v-for="(file, index) in files" :key="index">
                                    <v-icon v-if="file != ''" color='rgb(73, 185, 221)' style="margin-right: 10px;">mdi-file-upload</v-icon>
                                    <a :href="fileDownloadEndPoint + '/' + file.file_id" download>{{ file.file_name.split(".")[0] }}</a>
                            </v-flex>
                        </v-layout>
                    </v-flex>

                    <v-flex id="progress_bottom_edit" class="progress_bottom btn_2">
                        <v-layout align-center justify-end row class="progress_bottom" style="margin: 0px;">
                            <v-flex shrink style = "margin-right: 10px;">{{ parseInt(month) }}月{{ parseInt(day) }}日</v-flex>
                            <v-flex> {{ hr }}:{{ min }}</v-flex>
                            <v-flex shrink class="editBtns" @click="displayBtns">回复</v-flex>
                            <v-flex v-if = "value.ic_thumbup == 0 || !value.ic_thumbup" shrink class="editBtns" @click="displayOkBtn">点赞</v-flex>
                            <v-flex v-if = "value.ic_thumbup == 1" shrink class="editBtns" @click="displayAsBtn">已赞 1</v-flex>
                            <ConfirmDialogComponent v-on:click="bool => confirmClick(bool)" :option="taskIntercom"> 
                                <v-flex shrink class="editBtns">删除</v-flex>
                            </ConfirmDialogComponent>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-flex>
</v-sheet>
</template>

<script>
import ConfirmDialogComponent from '@/components/okrgoal/shared/ConfirmDialogComponent.vue';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import * as endPoint from "@/config/endpoints";

export default {
    props: ['ic_id', 'files', 'value', 'user_name', 'sender_id', 'timestamp'],
    components: {
        ConfirmDialogComponent,
    },
    data() {
       return {
           ok_btn: false,
           as_btn: true,
           year: null,
           month: null,
           day: null,
           hr: null,
           min: null,
           taskIntercom: "intercom",
       }
    },
    created() {
        const time = new Date(this.timestamp);
        this.year = time.getFullYear();
        this.month = time.getMonth() + 1;
        if(this.month < 10)
        {
            this.month = "0" + this.month.toString();
        }
        this.day = time.getDate();
        if(this.day < 10)
        {
            this.day = "0" + this.day.toString();
        }
        this.hr = time.getHours();
        if(this.hr < 10)
        {
            this.hr = "0" + this.hr.toString();
        }
        this.min = time.getMinutes();
        if(this.min < 10)
        {
            this.min = "0" + this.min.toString();
        }
    },
    computed: {
        fileDownloadEndPoint() {
            return endPoint.FILE_DOWNLOAD;
        }
    },
    methods: {
        displayBtns() {
            let replyIc = {
                ic_reply_ic: this.ic_id,
                sender_id: this.sender_id,
                displayReplyWindow: true
            }
            this.$emit("displayBtns", replyIc);
        },
        confirmClick(prop) {
            if(prop == true)
            {
               let removeIc = {
                   "ic_id" : this.ic_id
               }
               this.$emit("deleteCertainIntercom", removeIc);
            }
        },
        displayOkBtn() {
            this.ok_btn = true;
            this.as_btn = false;
            let param = {
                ic_id: this.ic_id,
                ic_thumbup: 1
            }
            this.$emit("updateIntercom", param);
        },
        displayAsBtn() {
            this.as_btn = true;
            this.ok_btn = false;
            let param = {
                ic_id: this.ic_id,
                ic_thumbup: 0
            }
            this.$emit("updateIntercom", param);
        }
    }
}
</script>

<style>
.w100 {
    width: 100%;
}
.reply {
    font-size: 14px;
    font-weight: bold;
    margin-right: 3px;
}
.mr_3 {
    margin-right: 3px;
}
.mb_40 {
    margin-bottom: 35px;
}
.background {
    background: rgb(250, 251, 252);
}
.multi-line {
    white-space: pre-line;
}
</style>