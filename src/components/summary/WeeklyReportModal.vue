<template>
    <v-dialog
        v-model="weekReport"
        width="915"
        persistent
        content-class="weekly_report"
    >
        <v-card>
            <v-card-title class="weekly_p_0">
                <v-system-bar class="modal-header p_0_15">
                    <v-layout d-flex align-center justify-start row class="width100 m_0">
                        <v-flex grow class="header-title">写周报</v-flex>
                        <v-flex shrink class="header-close"><v-icon class="header-close" @click="weekReport=false">mdi-close</v-icon></v-flex>
                    </v-layout>
                </v-system-bar>
            </v-card-title>
            <v-card-text class="pb_0">
                <v-container d-flex>
                    <v-layout align-center justify-center column class="width100 m_0">
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-start row class="width100 m_0 mb_20">
                                <v-flex shrink><span class="content-date">周报日期</span></v-flex>
                                <v-flex shrink class="mr_10">
                                    <v-select
                                        :items="years"
                                        label="设置年份"
                                        hide-details
                                        class="selectOption"
                                        @input="setYearOfWeekly"
                                        v-model="weeklyYear"
                                    ></v-select>
                                </v-flex>
                                <v-flex shrink class="mr_10">
                                    <v-select
                                        :items="months"
                                        label="设置月份"
                                        hide-details
                                        class="selectOption"
                                        @input="setMonthWeekly"
                                        v-model="weeklyMonth"
                                    ></v-select>
                                </v-flex>
                                <v-flex shrink>
                                    <v-select
                                        :items="weeks"
                                        label="设置周"
                                        hide-details
                                        class="selectOption"
                                        @input="setWeek"
                                        v-model="week"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-start row class="width100 m_0 mb_10">
                                <v-flex shrink><span class="weekly_task-progress"><span class="title">进行中任务</span><span class="value">{{ dailyTaskProgress }}</span><span class="help"><v-icon class="help">mdi-help-circle</v-icon></span></span></v-flex>
                                <v-flex shrink><span class="weekly_task-overdue"><span class="title">过期任务</span><span class="value">{{ dailyTaskOverdue }}</span></span></v-flex>
                                <v-flex grow><span class="weekly_task-mission"><span class="title">完成任务</span><span class="value">{{ dailyTaskMission }}</span></span></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-center column class="width100 m_0 mb_30 weekly_summary_obstacle">
                                <v-flex class="title_obstacle width100"><span>总结与障碍</span></v-flex>
                                <v-flex class="content_obstacle width100"><EditorContent v-model="dailySummaryObstacle" @input="handle_input_summary" /></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-center column class="width100 m_0 mb_30 weekly_next_work">
                                <v-flex class="title_nextWork width100"><span>下一步工作安排</span></v-flex>
                                <v-flex class="content_nextWork width100"><EditorContent v-model="dailyNextWork" @input="handle_input_next" /></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="width100">
                            <v-layout d-flex align-center justify-center column class="width100 m_0 mb_30 weekly_file_upload">

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
                                                    <v-avatar v-for="(contact,index) in weeklyTaContacts" :key="contact" color="warning lighten-2" size="32" class="contact_item">{{ contact | surename }}<v-icon size="15" class="remove_contact_item" @click="removeContactItem(index)">mdi-close-circle</v-icon></v-avatar>
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
                                        <v-flex class="width100"><v-checkbox label="同时向ta发送邮件" hide-details class="weekly_checkbox" v-model="weeklyTaMail"></v-checkbox></v-flex>
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
                    <v-flex shrink><v-btn color="primary" :disabled="submitBtnStatus" @click="submitWeeklyReport">提交</v-btn></v-flex>
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
            weekReport: false,
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

            weeklyYear: null,
            weeklyMonth: null,
            week: null,
            weeklyTaContacts: [],
            weeklyTaMail: false,
            dailyReportDataEdit: false,
            editRpID: null,
        }    
    },
    created() {
        let date = new Date();
        this.weeklyYear = date.getFullYear();
        this.weeklyMonth = date.getMonth() + 1 +"月";
        let adjustedDate = date.getDate() + date.getDay();
        let prefixes = ['0', '1', '2', '3', '4', '5'];
        let numberOfWeek = parseInt(prefixes[0 | adjustedDate / 7])+1;
        let certainWeek = constant.weekValue.filter((w) => w.id == numberOfWeek)[0];
        this.week = certainWeek.value;
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('report', ['weeklyReport']),
        visibleRange() {
            return constant.visibleRange;
        },
        submitBtnStatus() {
            if(!!this.weeklyYear && !!this.weeklyMonth && !!this.week && !!this.dailySummaryObstacle && !!this.dailyNextWork && !!this.dailyVisibleRange)
            {
                return false;
            } else {
                return true;
            }
        },
        years() {
            return constant.years;
        },
        months() {
            return constant.months;
        },
        weeks() {
            return constant.weeks;
        }
    },
    methods: {
        ...mapActions('report', ['addWeeklyReport', 'updateWeeklyReport']),
        displayWeeklyReportModal(prop) {
            if(prop.edit == true) {
                this.dailyReportDataEdit = true;
                this.editRpID = prop.rp.rp_id;
                this.weeklyYear = prop.rp.rp_date.split("-")[0];
                if(parseInt(prop.rp.rp_date.split("-")[1].split("/")[0]) < 10) {
                    this.weeklyMonth = prop.rp.rp_date.split("-")[1].split("/")[0].split("0")[1];
                } else {
                    this.weeklyMonth = prop.rp.rp_date.split("-")[1].split("/")[0];
                } 
                if(parseInt(prop.rp.rp_date.split("-")[1].split("/")[1]) < 10) {
                    this.week = prop.rp.rp_date.split("-")[1].split("/")[1].split("0")[1];
                } else {
                    this.week = prop.rp.rp_date.split("-")[1].split("/")[1];
                }
                this.dailySummaryObstacle = prop.rp.rp_abstract;
                this.dailyNextWork = prop.rp.rp_todo;
                this.dailyVisibleRange = prop.rp.rp_visible_range + 1;
                this.weeklyTaContacts = prop.rp.rp_ta_contacts.split(",");
            }
            this.weekReport = true;
        },
        handle_input_summary(prop) {
            this.dailySummaryObstacle = prop.prgValue;
        },
        handle_input_next(prop) {
            this.dailyNextWork = prop.prgValue;
        },
        setYearOfWeekly(e) {
            this.weeklyYear = e;
        },
        setMonthWeekly(e) {
            this.weeklyMonth = e;
        },
        setWeek(e) {
            this.week = e;
        },
        pickUser(e) {
            this.weeklyTaContacts.push(e.user.id);
        },
        removeContactItem(e) {
            this.weeklyTaContacts.splice(e, 1);
        },
        submitWeeklyReport() {
            let month = parseInt(this.weeklyMonth.split("月")[0]);
            if(month < 10)
            {
                month = "0" + month;
            }
            let week = constant.weekValue.filter((w) => w.value == this.week)[0].id;
            let dailyReportDate = this.weeklyYear + "-" + month + "/" + week;
            if(this.dailyReportDataEdit == true)
            {
                let param = {
                    "rp_id" : this.editRpID,
                    "rp_date": dailyReportDate,
                    "rp_abstract": this.dailySummaryObstacle.toString(),
                    "rp_todo": this.dailyNextWork.toString(),
                    "rp_visible_range": this.dailyVisibleRange-1,
                    "rp_ta_contacts": this.weeklyTaContacts.toString(),
                }
                this.updateWeeklyReport(param);
                this.$emit("displayRightSummaryEdit", this.weeklyReport);
            } else {
                let param = {
                    "rp_type": 1,
                    "rp_date": dailyReportDate,
                    "rp_abstract": this.dailySummaryObstacle.toString(),
                    "rp_todo": this.dailyNextWork.toString(),
                    "rp_visible_range": this.dailyVisibleRange-1,
                    "rp_ta_contacts": this.weeklyTaContacts.toString(),
                    "rp_publish_type": 1,
                    "rp_creator": this.authUser.id,
                    "rp_attatch_files": null,
                }
                this.addWeeklyReport(param);
            }
            this.weekReport = false;
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
.mr_10 {
    margin-right: 10px;
}
.mt_20 {
    margin-top: 20px;
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
.p_10 {
    padding: 10px;
}
.mr_20 {
    margin-right: 20px !important;
}
.weekly_report {
    height: 845px;
}
.weekly_report::-webkit-scrollbar {
    display: none;
}
.modal-header {
    background: linear-gradient(90deg,#1D86F0 6%,#5CADFF 94%);
    height: 40px !important;
    width: 100% !important;
}
.weekly_p_0 {
    padding: 0px !important;
    position: fixed;
    width: 915px;
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
.weekly_task-progress {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 40px;
}
.weekly_task-overdue {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 40px;
}
.weekly_task-mission {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.weekly_task-progress .title {
    font-size: 18px !important;
    color: #35434C;
    margin-right: 5px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.weekly_task-overdue .title {
    font-size: 18px !important;
    color: #35434C;
    margin-right: 5px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.weekly_task-mission .title {
    font-size: 18px !important;
    color: #35434C;
    margin-right: 5px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.weekly_task-progress .value {
    font-size: 23px;
    color: #A9B8BF;
    margin-right: 5px;
}
.weekly_task-overdue .value {
    font-size: 23px;
    color: #A9B8BF;
    margin-right: 5px;
}
.weekly_task-mission .value {
    font-size: 23px;
    color: #A9B8BF;
    margin-right: 5px;
}
.weekly_task-progress .help {
    font-size: 20px !important;
    color: #acb7bf !important;
    display: flex;
}
.weekly_summary_obstacle {
    border: 1px solid #E4EBF0;
}
.weekly_next_work {
    border: 1px solid #E4EBF0;
}
.weekly_summary_obstacle .title_obstacle {
    padding: 0 15px;
    color: #36434D;
    font-size: 16px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei" !important;
    height: 32px;
    display: flex;
    align-items: center;
}
.weekly_next_work .title_nextWork {
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
.selectOption {
    padding: 0px !important;
    margin: 0px !important;
}
.weekly_checkbox {
    padding: 0px;
    margin: 2px 0px 0px 0px;
}
.weekly_checkbox .v-icon {
    color: #82C4FF !important;
}
.weekly_checkbox .v-input--selection-controls__ripple {
    border-radius: 50% !important;
    cursor: pointer !important;;
    height: 20px !important;
    position: absolute !important;
    transition: inherit !important;
    width: 20px !important;
    left: -5px !important;
    top: calc(50% - 17px) !important;
    margin: 7px !important;
}
.ta_contacts {
    background: #F5F8FA;
}
.contacts_title {
    color: #647481;
    margin-right: 15px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}
.contacts_plus {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 2px;
    cursor: pointer;
}
.contact_item {
    margin-right:5px;
    position: relative;
}
.remove_contact_item {
    position: absolute !important;
    bottom: 0px;
    left: 0px;
    font-size: 30px !important;
    opacity: 0;
    transition: all ease .5s;
    cursor: pointer;
}
.contact_item:hover .remove_contact_item {
    opacity: 1;
}
</style>