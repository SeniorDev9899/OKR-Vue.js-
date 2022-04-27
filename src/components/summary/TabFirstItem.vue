<template>
<div  class="report d-flex justify-start align-start width100">
    <UserAvatar :name="authUser.employeeName" width="50px" height="50px" />
    <div class="report-content ml-4 width100">
        <div class="d-flex justify-space-between align-center mb-2">
            <div>
                <span style="color: #0a131a; font-weight: 700;">会计主管</span>
                <span>的日报</span>
            </div>
            <div>
                <v-icon>mdi-lock-outline</v-icon>
                <span>仅相关人可见</span>
            </div>
        </div>
        <div class="date-info my-4">
            <span class="mx-2">日报</span>
            <span v-if="type=='daily'" style="cursor: pointer;" @click="displayRightSummaryEdit">{{ getYear }}年{{ getMonth }}月{{ getDay }}日日报（{{ getDayOfWeek }}）</span>
            <span v-if="type=='weekly'" style="cursor: pointer;" @click="displayRightSummaryEdit">{{ getYear }}年{{ getMonth }}月{{ getWeek }}星期</span>
            <span v-if="type=='monthly'" style="cursor: pointer;" @click="displayRightSummaryEdit">{{ getYear }}年{{ getMonth }}月</span>
            <span style="color: #8379d6;">
                <v-icon>mdi-check</v-icon>
                延时提交
            </span>
        </div>
        <div class="overview my-4">
            <span class="mr-4">当日过期任务</span>
            <span style="color: #eb4447;">5</span>
        </div>
        <div class="left-line my-4">
            <span>总结与障碍</span>                            
        </div>
        <div class="my-4">
            <span>{{ getAbstract }}</span>
        </div>
        <div class="left-line my-4">
            <span>下一步工作安排</span>                            
        </div>
        <div class="my-4">
            <span>{{ getTodo }}</span>
        </div>
        <div class="d-flex justify-space-between align-center my-4">
            <div class="time-fb">
                {{ getFullTime.month }}/{{ getFullTime.day }} {{ getFullTime.hour }}:{{ getFullTime.minute }}
            </div>
            <div class="feed-action-tag d-flex justify-end align-center">
                <div class="action-tag">
                    <v-icon style="font-size:18px;">mdi-tag-outline</v-icon>
                    <span>标签</span>
                </div>
                <div class="mx-1">|</div>
                <div class="action-tag">
                    <v-icon style="font-size:18px;">mdi-currency-usd</v-icon>
                    <span>打赏</span>
                </div>
                <div class="mx-1">|</div>
                <div class="action-tag">
                    <v-icon style="font-size:18px;">mdi-heart-outline</v-icon>
                    <span>收藏</span>
                </div>
                <div class="mx-1">|</div>
                <div class="action-tag summary_intercom" @click="displayAddIntercom">
                    <v-icon class="message_icon" style="font-size:18px;">mdi-message-text-outline</v-icon>
                    <span>回复</span>
                </div>
                <div class="mx-1">|</div>
                <div class="action-tag">
                    <v-icon style="font-size:18px;">mdi-thumb-up-outline</v-icon>
                    <span>点赞</span>
                </div>
            </div>
        </div>
        <v-container v-if="!!report" d-flex class="width100 summary_intercom_p_0">
            <v-layout d-flex align-center justify-center class="width100 m_0">
                <AddSummaryIntercom :rp_id="report.rp_id" :displayEditWindow="showIntercomWindow" @showEditWindow="handle_showEditWindow" />
            </v-layout>
        </v-container>
        <v-divider class="width100 mtb_15"></v-divider>
    </div>
</div>
</template>

<script>
import AddSummaryIntercom from '@/components/summary/AddSummaryIntercom.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import { constant } from '@/constants/constant.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['report', 'type'],
    data() {
        return {
            showIntercomWindow: false,
        }
    },
    components: {
        AddSummaryIntercom,
        UserAvatar,
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        getYear() {
            if(!!this.report) {
                return this.report.rp_date.split("-")[0];
            }
        },  
        getMonth() {
            if(!!this.report) {
                if(this.type == "daily" || this.type == "monthly")   
                {
                    let month = this.report.rp_date.split("-")[1];
                    if(parseInt(month) < 10)
                    {
                        return month.split("0")[1];
                    } else {
                        return month;
                    }
                } else if(this.type == "weekly")
                {
                    let month = this.report.rp_date.split("-")[1].split("/")[0];
                    if(parseInt(month) < 10)
                    {
                        return month.split("0")[1];
                    } else {
                        return month;
                    }
                }   
            }  
        },
        getWeek() {
            if(!!this.report) {
                if(this.type == "weekly")
                {
                    let week = parseInt(this.report.rp_date.split("-")[1].split("/")[1]);
                    return constant.weekValue.filter((d) => d.id == week)[0].value;
                }
            }
        },
        getDay() {
            if(!!this.report) {
                if(this.type == "daily")
                {
                    let day = this.report.rp_date.split("-")[2];
                    if(parseInt(day) < 10)
                    {
                        return day.split("0")[1];
                    } else {
                        return day;
                    }
                }
            }
        },
        getDayOfWeek() {
            if(!!this.report) {
                if(this.type == "daily")
                {
                    let date = new Date(this.report.rp_date);
                    return constant.dayOfWeek.filter((d) => d.id == date.getDay())[0].value;
                }
            }
        },
        getAbstract(){
            if(!!this.report) {
                return this.report.rp_abstract.replace(/<[^>]+>/g, '');
            }
        },
        getTodo() {
            if(!!this.report) {
                return this.report.rp_todo.replace(/<[^>]+>/g, '');
            }
        },
        getFullTime() {
            if(!!this.report) {
                let date = new Date(this.report.created_at);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if(month < 10) {
                    month = "0" + month;
                }
                let day = date.getDate();
                let hour = date.getHours();
                if(hour < 10) {
                    hour = "0" + hour;
                }
                let minute = date.getMinutes();
                if(minute < 10) {
                    minute = "0" + minute;
                }
                return {
                    year: year,
                    month: month,
                    day: day,
                    hour: hour,
                    minute: minute,
                }
            }
        },
    },
    methods: {
        displayRightSummaryEdit() {
            this.$emit("displayRightSummaryEdit", this.report);
        },
        displayAddIntercom() {
            this.showIntercomWindow = !this.showIntercomWindow;
        },
        handle_showEditWindow() {
            this.showIntercomWindow = true;
        },
    }
}
</script>

<style>
.width100 {
    width: 100%;
}
</style>