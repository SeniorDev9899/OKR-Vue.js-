<template>
    <v-container d-flex class="width100 summary_header">
        <v-layout align-center justify-center column class="width100 m_0">
            <v-flex class="width100 header_title">
                <span>{{ year }}年{{ month }}月{{ day }}日 日报 ({{ dayOfWeek }})</span>
            </v-flex>
            <v-flex d-flex align-center justify-start class="width100 header_summary_date">
                <span class="date-supervisor">会计主管</span>
                <span class="date-write">撰写于</span>
                <span class="date-da">{{ year }}/{{ month }}/{{ day }} {{ hour }}:{{ minute }}</span>
                <v-divider vertical style="margin-right:5px;"></v-divider>
                <span><v-icon size="15" style="margin-right:3px">mdi-lock-open-outline</v-icon>仅相关成员<v-icon size="15">mdi-help-circle</v-icon></span>
            </v-flex>
            <v-flex d-flex align-center justify-start class="width100 header_label">
                <v-layout class="width100 m_0 mt_10">
                    <v-flex d-flex align-center shrink><span class="label-title">标签</span></v-flex>
                    <v-flex d-flex align-center shrink><span class="label-plus"><v-icon color="#2faa93" size="20">mdi-plus</v-icon></span></v-flex>
                    <v-flex d-flex align-center grow>
                        <v-layout d-flex align-center justify-start class="width100 m_0">
                            <v-flex shrink class="label-circle"><span class="mr_10"><v-icon color="#f99c19">mdi-circle-medium</v-icon>qqq</span></v-flex>
                            <v-flex shrink class="label-circle"><span class="mr_10"><v-icon color="#f04d4d">mdi-circle-medium</v-icon>daily</span></v-flex>
                            <v-flex shrink class="label-circle"><span class="mr_10"><v-icon color="#8f84db">mdi-circle-medium</v-icon>www</span></v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { constant } from '@/constants/constant.js'

export default {
    props: ['info'],
    data() {
        return {
        }
    },
    created() {
    },
    computed: {
        year() {
            if(!!this.info) {
                return this.info.rp_date.split("-")[0];
            }
        },
        month() {
            if(!!this.info) {
                let month;
                if(parseInt(this.info.rp_date.split("-")[1]) < 10)
                {
                    month = this.info.rp_date.split("-")[1].split("0")[1];
                } else {
                    month = this.info.rp_date.split("-")[1];
                }
                return month;
            }
        },
        day() {
            if(!!this.info) {
                let day;
                if(parseInt(this.info.rp_date.split("-")[2]) < 10)
                {
                    day = this.info.rp_date.split("-")[2].split("0")[1];
                } else {
                    day = this.info.rp_date.split("-")[2];
                }
                return day;
            }
        },
        dayOfWeek() {
            if(!!this.info) {
                let day = new Date(this.info.rp_date);
                return constant.dayOfWeek.filter((d) => d.id == day.getDay())[0].value;
            }
        },
        hour() {
            if(!!this.info) {
                let hour;
                let day = new Date(this.info.rp_date);
                hour = day.getHours();
                if(hour < 10)
                {
                    hour = "0" + hour;
                }
                return hour;
            }
        },
        minute() {
            if(!!this.info) {
                let minute;
                let day = new Date(this.info.rp_date);
                minute = day.getMinutes();
                if(minute < 10)
                {
                    minute = "0" + minute;
                }
                return minute;
            }
        }
    }
}
</script>

<style>
.mt_10 {
    margin-top: 10px !important;
}
.mr_10 {
    margin-right: 10px;
}
.summary_header {
    background-color: #f4f6f9;
}
.header_title {
    font-size: 20px;
    color: #36434D;
}
.header_summary_date {
    color: #647481;
    font-size: 12px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB",SimSun,STHeitiSC,sans-serif;
}
.date-supervisor {
    margin-right: 7px;
}
.date-write {
    margin-right: 5px;
}
.date-da {
    margin-right: 8px;
}
.label-title {
    color: #647481;
    font-size: 12px;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
    margin-right: 5px;
}
.label-plus {
    padding: 3px 3px;
    background-color: #e6edf2;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
}
.label-circle {
    height: 24px;
    border-radius: 24px;
    background: #e6edf2;
    font-size: 12px;
    margin-right: 25px;
}
</style>