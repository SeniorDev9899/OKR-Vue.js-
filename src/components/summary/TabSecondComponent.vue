<template>
    <v-container d-flex class="width100 p_0 summary_weekly">
        <v-layout align-start justify-start row class="width100 m_0">
            <v-flex grow>
                <v-container d-flex class="width100">
                    <v-layout align-start justify-start column class="width100 m_0">
                        <v-flex d-flex align-center justify-start class="width100">
                            <span class="weekly_title">我的周报</span>
                            <span class="weekly_value">{{ year }}年{{ month }}月{{ weekName }}</span>
                        </v-flex>
                        <v-flex d-flex align-center justify-start class="width100">
                            <v-btn v-if="!!weeklyReport" color="primary" class="mt_20" @click="displayWeeklyReportModal({edit: true, rp: weeklyReport})">写日报</v-btn>                    
                            <v-btn v-else color="primary" class="mt_20" @click="displayWeeklyReportModal({edit:false})">编辑日报</v-btn>
                        </v-flex>
                        <v-flex v-if="!!weeklyReport" d-flex align-center justify-start class="width100 mt_30">
                            <TabFirstItem :report="weeklyReport" :type="re_type" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
                        </v-flex>
                        <v-flex v-else d-flex align-center justify-start class="width100 mt_30 empty_weekly_summary">
                            <span class="width100 empty_contain">
                                <p>您尚未提交当周周报</p>
                                <p>总结工作更有助于效率提升哦~</p>
                            </span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
            <v-flex shrink>
                <v-layout d-flex align-start justify-center row>
                    <v-flex>
                        <v-date-picker
                            v-model="datePicker"
                            :first-day-of-week="0"
                            locale="zh-cn"
                            class="weekPicker"
                            type="month"
                        ></v-date-picker>
                    </v-flex>
                    <v-flex >
                        <v-list dense>
                            <v-list-item-group
                                v-model="selectedItem"
                                color="primary"
                            >
                                <v-list-item
                                    v-for="(week, i) in weeks"
                                    :key="i"
                                    class="item_week"
                                    @click="setDateOfWeeklyReport(week)"
                                >
                                    <v-list-item-content>
                                        <v-list-item-title v-text="week.name + ' ' + week.period"></v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-divider class="width100"></v-divider>
        <TabFirstItem v-if="allWeeklyReport.length != 0" v-for="(rp, index) in allWeeklyReport" :key="index" :report="rp" :type="re_type" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
        <WeeklyReportModal ref="weeklyReport" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
    </v-container>
</template>

<script>
import TabFirstItem from '@/components/summary/TabFirstItem.vue';
import WeeklyReportModal from '@/components/summary/WeeklyReportModal.vue';
import { mapGetters, mapActions } from 'vuex';
import { constant } from '@/constants/constant.js';

export default {
    props: ['year', 'month'],
    data() {
        return {
            re_year: null,
            re_month: null,
            re_week: null,
            re_type: "weekly",
            weekName: "",
            selectedItem: 2,
            weeks: [],
            weeksNumber: null,
        }
    },
    created() {
        this.re_year = this.year;
        if(!!this.year) {
            this.re_year = this.year;
        } else {
            this.re_year = (new Date()).getFullYear();
        }
        if(!!this.month) {
            if(this.month < 10)
            {
                this.re_month = "0" + this.month;
            } else {
                this.re_month = this.month;
            }
        } else {
            this.re_month = (new Date()).getMonth + 1 < 10 ? "0" + ((new Date()).getMonth + 1) : ((new Date()).getMonth + 1);
        }

        // Initialize the week array from month props
        let days = constant.monthDays.filter((i) => i.month == parseInt(this.re_month))[0];
        let dayOfWeek = new Date(this.re_year + "-" + this.re_month + "-" + "01").getDay();
        if(dayOfWeek == 0) {
            this.weeksNumber = Math.ceil(days.days/7);
        } else if(dayOfWeek == 1) {
            this.weeksNumber = Math.ceil((days.days + 1)/7);
        } else {
            this.weeksNumber = Math.ceil((days.days - (7-dayOfWeek))/7);
        }
        let startDate = constant.startForDay.filter((i) => i.dayOfWeek == dayOfWeek)[0].start;
        let endDate = startDate + 6;
        this.weeks = [];
        this.weeks.push({
            name: "第" + 1 + "周",
            period: parseInt(this.re_month) + "/" + startDate + "~" + parseInt(this.re_month) + "/" + endDate,
        });
        for(let i = 1; i<this.weeksNumber-1; i++) {
            endDate = startDate + 7*(i+1) - 1;
            let start = parseInt(this.weeks[i-1].period.split('~')[1].split("/")[1]) + 1;
            this.weeks.push({
                name: "第" + (i+1) + "周",
                period: this.weeks[i-1].period.split('~')[1].split("/")[0] + "/" + start + "~" + parseInt(this.re_month) + "/" + endDate,
            });
        }
        let next_month = (parseInt(this.re_month) + 1) < 10 ? "0" + (parseInt(this.re_month) + 1) : (parseInt(this.re_month) + 1);
        let dayOfWeekNextMonth = (new Date(this.re_year + "-" + next_month + "-" + "01")).getDay();
        if(endDate != days.days && next_month <= 12) {
            if(dayOfWeekNextMonth == 1) {
                this.weeks.push({
                    name: "第" + this.weeksNumber + "周",
                    period: parseInt(this.re_month) + "/" + (endDate + 1) + "~" + parseInt(this.re_month) + "/" + days.days,
                });
            } else if(dayOfWeekNextMonth == 0) { 
                let next_month_start = constant.startForDay.filter((i) => i.dayOfWeek == dayOfWeekNextMonth)[0].start;
                this.weeks.push({
                    name: "第" + this.weeksNumber + "周",
                    period: parseInt(v.split("-")[1]) + "/" + (endDate + 1) + "~" + next_month + "/" + "1",
                });
            } else {
                let next_month_start = constant.startForDay.filter((i) => i.dayOfWeek == dayOfWeekNextMonth)[0].start;
                this.weeks.push({
                    name: "第" + this.weeksNumber + "周",
                    period: parseInt(this.re_month) + "/" + (endDate + 1) + "~" + next_month + "/" + (next_month_start - 1),
                });
            }
        } else if(next_month == 13) {
            this.weeks.push({
                name: "第" + this.weeksNumber + "周",
                period: parseInt(this.re_month) + "/" + (endDate + 1) + "~" + parseInt(this.re_month) + "/" + days.days,
            })
        }        

        // Get Week Name and Week Number From Current Date;
        let currentDay = (new Date()).getDate() < 10 ? "0" + (new Date()).getDate() : (new Date()).getDate();
        let numberOfWeek;
        if(dayOfWeek < 2) {
            numberOfWeek = Math.ceil(currentDay/7);
        } else {
            numberOfWeek = Math.ceil((currentDay-(7-dayOfWeek))/7);
        }
        let certainWeek = constant.weekValue.filter((w) => w.id == numberOfWeek)[0];
        this.weekName = certainWeek.value;
        this.re_week = certainWeek.id;

        this.selectedItem = this.weeks.findIndex((i) => i.name == this.weekName);

        let param = {
            "rp_creator" : this.authUser.id,
            "rp_date" : this.re_year + "-" + this.re_month + "/" + this.re_week,
            "rp_type" : 1,
        }
        this.getWeeklyReport(param);
        this.getAllWeeklyReportWithCreator({"rp_creator" : this.authUser.id, "rp_type" : 1});
    },
    watch: {
        year(newValue, oldValue) {
            this.re_year = newValue;
        },
        month(newValue, oldValue) {
            if(newValue < 10)
            {
                this.re_month = "0" + newValue;
            } else {
                this.re_month = newValue;
            }
            let param = {
                "rp_creator" : this.authUser.id,
                "rp_date" : this.re_year + "-" + this.re_month + "/" + this.re_week,
                "rp_type" : 1,
            }
            this.getWeeklyReport(param);
        }
    },
    components: {
        TabFirstItem,
        WeeklyReportModal,
    },
    computed: {
        ...mapGetters('report', ['weeklyReport', 'allWeeklyReport']),
        ...mapGetters('auth', ['authUser']),
        datePicker: {
            get() {
                // return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
                return new Date().toISOString().substr(0, 7)
            },
            set(v) {
                let days = constant.monthDays.filter((i) => i.month == parseInt(v.split("-")[1]))[0];
                let date = new Date(v + "-" + "01");
                let dayOfWeek = date.getDay();
                if(dayOfWeek == 0) {
                    this.weeksNumber = Math.ceil(days.days/7);
                } else if(dayOfWeek == 1) {
                    this.weeksNumber = Math.ceil((days.days + 1)/7);
                } else {
                    this.weeksNumber = Math.ceil((days.days - (7-dayOfWeek))/7);
                }
                let startDate = constant.startForDay.filter((i) => i.dayOfWeek == dayOfWeek)[0].start;
                let endDate = startDate + 6;
                this.weeks = [];
                this.weeks.push({
                    name: "第" + 1 + "周",
                    period: parseInt(v.split("-")[1]) + "/" + startDate + "~" + parseInt(v.split("-")[1]) + "/" + endDate,
                });
                for(let i = 1; i<this.weeksNumber-1; i++) {
                    endDate = startDate + 7*(i+1) - 1;
                    let start = parseInt(this.weeks[i-1].period.split('~')[1].split("/")[1]) + 1;
                    this.weeks.push({
                        name: "第" + (i+1) + "周",
                        period: this.weeks[i-1].period.split('~')[1].split("/")[0] + "/" + start + "~" + parseInt(v.split("-")[1]) + "/" + endDate,
                    });
                }
                let next_month = (parseInt(v.split("-")[1]) + 1) < 10 ? "0" + (parseInt(v.split("-")[1]) + 1) : (parseInt(v.split("-")[1]) + 1);
                let dayOfWeekNextMonth = (new Date(v.split("-")[0] + "-" + next_month + "-" + "01")).getDay();
                if(endDate != days.days && next_month <= 12) {
                    if(dayOfWeekNextMonth == 1) {
                        this.weeks.push({
                            name: "第" + this.weeksNumber + "周",
                            period: parseInt(v.split("-")[1]) + "/" + (endDate + 1) + "~" + parseInt(v.split("-")[1]) + "/" + days.days,
                        });
                    } else if(dayOfWeekNextMonth == 0) { 
                        let next_month_start = constant.startForDay.filter((i) => i.dayOfWeek == dayOfWeekNextMonth)[0].start;
                        this.weeks.push({
                            name: "第" + this.weeksNumber + "周",
                            period: parseInt(v.split("-")[1]) + "/" + (endDate + 1) + "~" + next_month + "/" + "1",
                        });
                    } else {
                        let next_month_start = constant.startForDay.filter((i) => i.dayOfWeek == dayOfWeekNextMonth)[0].start;
                        this.weeks.push({
                            name: "第" + this.weeksNumber + "周",
                            period: parseInt(v.split("-")[1]) + "/" + (endDate + 1) + "~" + next_month + "/" + (next_month_start - 1),
                        });
                    }
                } else if(next_month == 13) {
                    this.weeks.push({
                        name: "第" + this.weeksNumber + "周",
                        period: parseInt(v.split("-")[1]) + "/" + (endDate + 1) + "~" + parseInt(v.split("-")[1]) + "/" + days.days,
                    })
                }
            }
        }
    },
    methods: {
        ...mapActions('report', ['getWeeklyReport', 'getAllWeeklyReportWithCreator']),
        handle_displayRightSummaryEdit(prop) {
            let param = {
                value: prop,
                type: "weekly",
            }
            this.$emit("displayRightSummaryEdit", param);
        },
        setDateOfWeeklyReport(prop) {   
            let weekNumber = prop.name.split('第')[1].split("周")[0];
            let param = {
                "rp_creator" : this.authUser.id,
                "rp_date" : this.re_year + "-" + this.re_month + "/" + weekNumber,
                "rp_type" : 1,
            }
            this.weekName = constant.weekValue.filter((i) => i.id == weekNumber)[0].value;
            this.getWeeklyReport(param);
        },
        displayWeeklyReportModal(prop) {
            this.$refs.weeklyReport.displayWeeklyReportModal(prop);
        }
    }
}
</script>

<style>
.width100 {
    width: 100%
}
.m_0 {
    margin: 0px;
}
.p_0 {
    padding: 0px;
}
.weekly_title {
    font-size: 20px !important;
    color: #555 !important;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif !important;
    margin-right: 10px;
}
.weekly_value {
    font-size: 20px !important;
    color: #555 !important;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif !important;
}
.mt_20 {
    margin-top: 20px;
}
.mt_30 {
    margin-top: 30px;
}
.summary_weekly {
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.empty_weekly_summary {
    padding: 30px 25px;
    border: dashed 1px #c5c5c5;
}
.empty_contain {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 22px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
    color: #c5c5c5;
}
.weekPicker .v-picker__title{
    display: none !important;
}
.item_week {
    min-height: 29px !important;
    height: 29px;
    margin-bottom: 15px;
    background: rgb(237 244 245);
    border-radius: 5px;
}
</style>