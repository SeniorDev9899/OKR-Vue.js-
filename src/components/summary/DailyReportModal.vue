<template>
    <v-dialog
        v-model="dayReport"
        width="800"
        persistent
        content-class="daily_report"
    >
        <v-card>
            <v-card-title class="daily_p_0">
                <v-system-bar class="modal-header p_0_15">
                    <v-layout d-flex align-center justify-start row class="width100 m_0">
                        <v-flex grow class="header-title">编辑日报</v-flex>
                        <v-flex shrink class="header-close"><v-icon class="header-close" @click="dayReport=false">mdi-close</v-icon></v-flex>
                    </v-layout>
                </v-system-bar>
            </v-card-title>
            <v-card-text class="pb_0">
                <v-container d-flex>
                    <v-layout align-center justify-center column class="width100 m_0">
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-start row class="width100 m_0 mb_20">
                                <v-flex shrink><span class="content-date">日报日期</span></v-flex>
                                <v-flex grow>
                                    <v-menu
                                        ref="dailyReportDate"
                                        v-model="report_date"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                        content-class="daily_date_picker"
                                    >
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on">
                                                    <span class="daily_date">{{year}}/{{month}}/{{day}} ({{dayOfWeek}})</span>
                                                    <v-icon size="18" color="#1687d9" class="daily_calendar">mdi-calendar-text-outline</v-icon>
                                                </span>
                                            </template>
                                            <v-date-picker
                                                v-model="dailyReportDate"
                                                scrollable
                                                locale="zh-cn"
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="report_date = false"
                                                >
                                                    取消
                                                </v-btn>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="setDailyReportDate"
                                                >
                                                    好的
                                                </v-btn>
                                            </v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-start row class="width100 m_0 mb_10">
                                <v-flex shrink><span class="daily_task-progress"><span class="title">进行中任务</span><span class="value">{{ dailyTaskProgress }}</span><span class="help"><v-icon class="help">mdi-help-circle</v-icon></span></span></v-flex>
                                <v-flex shrink><span class="daily_task-overdue"><span class="title">过期任务</span><span class="value">{{ dailyTaskOverdue }}</span></span></v-flex>
                                <v-flex grow><span class="daily_task-mission"><span class="title">完成任务</span><span class="value">{{ dailyTaskMission }}</span></span></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-center column class="width100 m_0 mb_30 daily_summary_obstacle">
                                <v-flex class="title_obstacle width100"><span>总结与障碍</span></v-flex>
                                <v-flex class="content_obstacle width100"><EditorContent v-model="dailySummaryObstacle" @input="handle_input_summary" /></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-center column class="width100 m_0 mb_30 daily_next_work">
                                <v-flex class="title_nextWork width100"><span>下一步工作安排</span></v-flex>
                                <v-flex class="content_nextWork width100"><EditorContent v-model="dailyNextWork" @input="handle_input_next" /></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-start row class="width100 m_0 mb_10 daily_file_upload">
                                <v-flex shrink><span class="title_fileUpload">上传附件</span></v-flex>
                                <v-flex grow><span class="submit_fileUpload">点击上传</span></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-center row class="width100 m_0 mb_10 daily_visibleRange">
                                <v-flex shrink class="title_visibleRange"><span class="mr_30">可见范围</span></v-flex>
                                <v-flex grow>
                                    <v-radio-group
                                        v-model="dailyVisibleRange"
                                        row
                                    >
                                        <v-radio
                                            v-for="(item, index) in visibleRange"
                                            :key="item.id"
                                            :label="item.value"
                                            :value="item.id"
                                            class="visible_item"
                                        ></v-radio>
                                    </v-radio-group>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100 ta_contacts">
                            <v-layout d-flex align-start justify-center row class="width100 m_0 p_10">
                                <v-flex shrink>
                                    <span class="contacts_title">@ta查看</span>
                                </v-flex>
                                <v-flex grow>
                                    <v-layout d-flex align-center justify-start column class="width100 m_0">
                                        <v-flex class="width100">
                                            <v-layout d-flex align-center justify-start row class="width100 m_0">
                                                <v-flex shrink style="margin-right:10px;">
                                                    <v-avatar v-for="(contact,index) in dailyTaContacts" :key="contact" color="warning lighten-2" size="32" class="contact_item">{{ contact | surename }}<v-icon size="15" class="remove_contact_item" @click="removeContactItem(index)">mdi-close-circle</v-icon></v-avatar>
                                                </v-flex>
                                                <v-flex grow>
                                                    <v-menu max-width="300" :close-on-content-click="true" offset-y>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <span v-bind="attrs" v-on="on" class='contacts_plus'><v-icon color="#3aab6e" size="35">mdi-plus-circle-outline</v-icon></span>
                                                        </template>
                                                        <v-sheet>
                                                            <UserPicker @pick="pickUser" />
                                                        </v-sheet>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-divider class="width100"></v-divider>
                                        <v-flex class="width100"><v-checkbox label="同时向ta发送邮件" hide-details class="weekly_checkbox" v-model="dailyTaMail"></v-checkbox></v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions class="pt_0 pb_20 mt_20">
                <v-layout d-flex align-center justify-start row class="width100 m_0">
                    <v-flex grow d-flex align-center justify-end class="mr_20"><v-btn>取消</v-btn></v-flex>
                    <v-flex shrink><v-btn color="primary" :disabled="submitBtnStatus" @click="submitDailyReport">提交</v-btn></v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import { constant } from '@/constants/constant.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        EditorContent,
        UserPicker,
    },
    data() {
        return {
            dayReport: false,
            report_date: false,
            year: null,
            month: null,
            day: null,
            dayOfWeek: null, 
            dailyTaskProgress: 0,
            dailyTaskOverdue: 0,
            dailyTaskMission: 0,
            dailyReportDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dailySummaryObstacle: null,
            dailyNextWork: null,
            dailyVisibleRange: 1,
            dailyReportDataEdit: false,
            editRpID: null,
            dailyTaContacts: [],
            dailyTaMail: false,
        }    
    },
    created() {
        let date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        if(this.month < 10) {
            this.month = "0" + this.month;
        }
        this.day = date.getDate();
        if(this.day < 10) {
            this.day = "0" + this.day;
        }
        this.dayOfWeek = constant.dayOfWeek.filter((d) => d.id == date.getDay())[0].value;
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('report', ['dailyReport']),
        visibleRange() {
            return constant.visibleRange;
        },
        submitBtnStatus() {
            if(!!this.dailyReportDate && !!this.dailySummaryObstacle && !!this.dailyNextWork && !!this.dailyVisibleRange)
            {
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        ...mapActions('report', ['addDailyReport', 'updateDailyReport']),
        displayModal(prop) {
            if(prop.edit == true) {
                this.dailyReportDataEdit = true;
                this.editRpID = prop.rp.rp_id;
                this.year = prop.rp.rp_date.split("-")[0];
                if(parseInt(prop.rp.rp_date.split("-")[1]) < 10) {
                    this.month = prop.rp.rp_date.split("-")[1].split("0")[1];
                } else {
                    this.month = prop.rp.rp_date.split("-")[1];
                } 
                if(parseInt(prop.rp.rp_date.split("-")[2]) < 10) {
                    this.day = prop.rp.rp_date.split("-")[2].split("0")[1];
                } else {
                    this.day = prop.rp.rp_date.split("-")[2];
                }
                let date = new Date(prop.rp.rp_date);
                this.dayOfWeek = constant.dayOfWeek.filter((d) => d.id == date.getDay())[0].value;
                this.dailySummaryObstacle = prop.rp.rp_abstract;
                this.dailyNextWork = prop.rp.rp_todo;
                this.dailyVisibleRange = prop.rp.rp_visible_range + 1;
                this.dailyTaContacts = prop.rp.rp_ta_contacts.split(",");
            }
            this.dayReport = true;
        },
        setDailyReportDate() {
            this.$refs.dailyReportDate.save(this.dailyReportDate);
            this.report_date = false;
            this.year = this.dailyReportDate.split("-")[0];
            this.month = this.dailyReportDate.split("-")[1];
            this.day = this.dailyReportDate.split("-")[2];
            let new_date = new Date(this.dailyReportDate);
            this.dayOfWeek = constant.dayOfWeek.filter((d) => d.id == new_date.getDay())[0].value;
        },
        handle_input_summary(prop) {
            this.dailySummaryObstacle = prop.prgValue;
        },
        handle_input_next(prop) {
            this.dailyNextWork = prop.prgValue;
        },
        pickUser(e) {
            this.dailyTaContacts.push(e.user.id);
        },
        removeContactItem(e) {
            this.dailyTaContacts.splice(e, 1);
        },
        submitDailyReport() {
            if(this.dailyReportDataEdit == true)
            {
                let param = {
                    "rp_id" : this.editRpID,
                    "rp_date": this.dailyReportDate,
                    "rp_abstract": this.dailySummaryObstacle.toString(),
                    "rp_todo": this.dailyNextWork.toString(),
                    "rp_visible_range": this.dailyVisibleRange-1,
                    "rp_ta_contacts": this.dailyTaContacts.toString(),
                }
                this.updateDailyReport(param);
                this.$emit("displayRightSummaryEdit", this.dailyReport);
            } else {
                let param = {
                    "rp_type": 0,
                    "rp_date": this.dailyReportDate,
                    "rp_abstract": this.dailySummaryObstacle.toString(),
                    "rp_todo": this.dailyNextWork.toString(),
                    "rp_visible_range": this.dailyVisibleRange-1,
                    "rp_ta_contacts": this.dailyTaContacts.toString(),
                    "rp_publish_type": 1,
                    "rp_creator": this.authUser.id,
                    "rp_attatch_files": null,
                }
                this.addDailyReport(param);
            }
            this.dayReport = false;
        }
    }
}
</script>

<style>
.width100 {
    width: 100%;
}
.m_0 {
    margin: 0px;
}
.p_0_15 {
    padding: 0px 15px !important;
}
.mb_20 {
    margin-bottom: 20px !important;
}
.mb_10 {
    margin-bottom: 10px !important;
}
.mb_30 {
    margin-bottom: 30px !important;
}
.mr_30 {
    margin-right: 30px; 
}
.pb_0 {
    padding-bottom: 0px;
    position: relative;
    top: 45px;
}
.pb_20 {
    padding-bottom: 20px;
}
.pt_0 {
    padding-top: 0px;
}
.mr_20 {
    margin-right: 20px !important;
}
.daily_report {
    height: 845px;
}
.daily_report::-webkit-scrollbar {
    display: none;
}
.modal-header {
    background: linear-gradient(90deg,#1D86F0 6%,#5CADFF 94%);
    height: 40px !important;
    width: 100% !important;
}
.daily_p_0 {
    padding: 0px !important;
    position: fixed;
    width: 800px;
    z-index: 1;
}
.header-title {
    font-size: 17.5px;
    color: #fff;
}
.header-close {
    font-size: 21px !important;
    color: #fff !important;
    cursor: pointer;
}
.content-date {
    color: #70808B;
    font-size: 14px;
    margin-right: 20px;
}
.daily_calendar {
    position: relative;
    bottom: 2px;
}
.daily_date {
    margin-right: 10px;
    color: #36434D;
}
.daily_date_picker {
    top: 118px !important;
}
.daily_task-progress {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 40px;
}
.daily_task-overdue {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 40px;
}
.daily_task-mission {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.daily_task-progress .title {
    font-size: 18px !important;
    color: #35434C;
    margin-right: 5px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.daily_task-overdue .title {
    font-size: 18px !important;
    color: #35434C;
    margin-right: 5px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.daily_task-mission .title {
    font-size: 18px !important;
    color: #35434C;
    margin-right: 5px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.daily_task-progress .value {
    font-size: 23px;
    color: #A9B8BF;
    margin-right: 5px;
}
.daily_task-overdue .value {
    font-size: 23px;
    color: #A9B8BF;
    margin-right: 5px;
}
.daily_task-mission .value {
    font-size: 23px;
    color: #A9B8BF;
    margin-right: 5px;
}
.daily_task-progress .help {
    font-size: 20px !important;
    color: #acb7bf !important;
    display: flex;
}
.daily_summary_obstacle {
    border: 1px solid #E4EBF0;
}
.daily_next_work {
    border: 1px solid #E4EBF0;
}
.daily_summary_obstacle .title_obstacle {
    padding: 0 15px;
    color: #36434D;
    font-size: 16px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei" !important;
    height: 32px;
    display: flex;
    align-items: center;
}
.daily_next_work .title_nextWork {
    padding: 0 15px;
    color: #36434D;
    font-size: 16px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei" !important;
    height: 32px;
    display: flex;
    align-items: center;
}
.daily_visibleRange .title_visibleRange {
    color: #647481;
    font-size: 14px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.visible_item .v-label {
    font-size: 15px !important;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB",SimSun,STHeitiSC,sans-serif !important;
    color: #36434D !important;
}
.title_fileUpload {
    color: #647481;
    margin-right: 4px;
}
.submit_fileUpload {
    cursor: pointer;
    color: #005999;
}
</style>