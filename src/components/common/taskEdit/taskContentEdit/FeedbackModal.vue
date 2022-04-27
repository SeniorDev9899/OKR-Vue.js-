<template>
    <v-dialog v-model="feedbackShow" overlay-opacity="0" overlay-color="white" content-class="feedbackDialog" width="420">
        <v-card-title class="width100 m_0">
            <v-system-bar class="width100 feedback p_0_feedback">
                <v-container class="width100 m_0 p_0">
                    <v-layout d-flex align-center justify-start row class="feedback-set m_0">
                        <v-flex grow align-center justify-start><span class="feedback_title">设置反馈提醒</span></v-flex>
                        <v-flex shrink><span class="feedback_subTitle">提醒时间</span></v-flex>
                    </v-layout>
                </v-container>
            </v-system-bar>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-layout d-flex align-center justify-start row>
                    <v-flex shrink class="mr_19"><span class="text_title">提醒时间</span></v-flex>
                    <v-flex shrink class="width_90 mr_19">
                        <!-- <v-select
                            v-model="feedbackCycle"
                            :items="cycles"
                            item-text="state"
                            item-value="abbr"
                            label="设置循环"
                            return-object
                            single-line
                            @input="setFeedbackCycle"
                        ></v-select> -->
                        <v-menu offset-y content-class="feedback_menu">
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on"><span>{{ feedbackCycle }}</span><v-icon>mdi-menu-down</v-icon></span>
                            </template>
                            <v-list class="feedback_list">
                                <v-list-item v-for="cycle in cycles" :key="cycle.id" @click="setFeedbackCycle(cycle)" class="feedback_list_item">
                                    <v-list-item-title>
                                        {{ cycle.state }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-flex>
                    <v-flex shrink class="width_90 mr_19">
                        <!-- <v-select
                            v-model="feedbackHour"
                            :items="hours"
                            item-text="state"
                            item-value="abbr"
                            label="设置小时"
                            return-object
                            single-line
                            @input="setFeedbackHour"
                        ></v-select> -->
                        <v-menu offset-y content-class="feedback_menu">
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on"><span>{{ feedbackHour }}</span><v-icon>mdi-menu-down</v-icon></span>
                            </template>
                            <v-list class="feedback_list">
                                <v-list-item v-for="hour in hours" :key="hour.state" @click="setFeedbackHour(hour)" class="feedback_list_item">
                                    <v-list-item-title>
                                        {{ hour.state }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-flex>
                    <v-flex shrink class="width_90">
                        <!-- <v-select
                            v-model="feedbackMinute"
                            :items="minutes"
                            item-text="state"
                            item-value="abbr"
                            label="设置分钟"
                            return-object
                            single-line
                            @input="setFeedbackMinute"
                        ></v-select> -->
                        <v-menu offset-y content-class="feedback_menu">
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on"><span>{{ feedbackMinute }}</span><v-icon>mdi-menu-down</v-icon></span>
                            </template>
                            <v-list class="feedback_list">
                                <v-list-item v-for="minute in minutes" :key="minute.state" @click="setFeedbackMinute(minute)" class="feedback_list_item">
                                    <v-list-item-title>
                                        {{ minute.state }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-layout d-flex align-center justify-end row class="width100 m_0">
                <v-flex grow align-center justify-end d-flex class="mr_10"><v-btn @click="closeFeedbackModal">取消</v-btn></v-flex>
                <v-flex shrink><v-btn color="primary" @click="submitFeedbackTime" :disabled="!!feedbackCycleValue && !!feedbackHourValue && !!feedbackMinuteValue ? false : true">确定</v-btn></v-flex>
            </v-layout>
        </v-card-actions>
    </v-dialog>
</template>

<script>
import { constant } from '@/constants/constant.js'

export default {
    data() {
        return {
            feedbackShow: false,
            feedbackCycleValue: null,
            feedbackHourValue: null,
            feedbackMinuteValue: null,
        }
    },
    computed: {
        feedbackCycle() {
            if(!!this.feedbackCycleValue)
            {
                return this.feedbackCycleValue;
            } else {
                return "设置循环";
            }
        },
        feedbackHour() {
            if(!!this.feedbackHourValue)
            {
                return this.feedbackHourValue;
            } else {
                return "设置小时";
            }
        },
        feedbackMinute() {
            if(!!this.feedbackMinuteValue)
            {
                return this.feedbackMinuteValue;
            } else {
                return "设置分钟";
            }
        },
        cycles() {
            return constant.items_cycles;
        },
        hours() {
            return constant.items_hours;
        },
        minutes() {
            return constant.items_minutes;
        }
    },
    methods: {
        openFeedbackModal(prop) {
            this.feedbackShow = true;
        },
        setFeedbackCycle(prop) {
            this.feedbackCycleValue = prop;
        },
        setFeedbackHour(prop) {
            this.feedbackHourValue = prop;
        },
        setFeedbackMinute(prop) {
            this.feedbackMinuteValue = prop;
        },
        closeFeedbackModal() {
            this.feedbackShow = false;
        },
        submitFeedbackTime() {
            this.$emit("setFeedbackTime", {cycle: this.feedbackCycle, hour: this.feedbackHour, minute: this.feedbackMinute});
            this.feedbackShow = false;
        }
    }
}
</script>

<style>
.feedbackDialog {
    position: absolute;
    top: 471px;
    right: 60px;
    background-color:white;
}
.feedback {
    background-color: white !important;
    height: 40px;
}
.feedback-set {
    height: 30px;
    border-bottom: 1px solid #1881d0;
    font-size: 14px;
    color: #333;
    margin-bottom: 28px;
    width: 100%;
    height: 100%;
}
.feedback_title {
    font-size: 14px;
    font-family: "Helvetica Neue",Helvetica,arial,"Hiragino Sans GB",\5b8b\4f53,sans-serif;
    color: #333;
    height: 100%;
}
.feedback_subTitle {
    color: #005999;
    font-size: 12px;
    font-family: "Helvetica Neue",Helvetica,arial,"Hiragino Sans GB",\5b8b\4f53,sans-serif;
    height: 100%;
    cursor: pointer;
}
.feedback_menu {
    top: 575px !important;
}
.feedback_list {
    height: 400px;
}
.feedback_list_item:hover {
    background-color: rgb(207 235 244);
}
.p_0_feedback {
    padding: 0px !important;
}
.text_title {
    color: #70808b;
    font-size: 14px;
}
.mr_19 {
    margin-right: 19px;
}
.width_90 {
    width: 90px;
}
</style>