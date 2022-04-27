<template>
    <div class="tab-1-content">
        <v-row>
            <v-col cols="9">
                <h2 class="mb-4 title">我的日报 {{ year }}年{{ month }}月{{ day }}日（{{ dayOfWeek }}）</h2>
                <div class="mb-8">
                    <v-btn v-if="!!dailyReport" color="#1B6CF1" @click="displayDailyReportModal({edit: true, rp: dailyReport})">写日报</v-btn>                    
                    <v-btn v-else color="primary" @click="displayDailyReportModal({edit: false})">编辑日报</v-btn>
                </div>
                <TabFirstItem v-if="!!dailyReport" :report="dailyReport" :type="re_type" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
                <div v-else class="rect">
                    <div>您尚未提交当日日报</div>
                    <div>总结工作更有助于效率提升哦~</div>
                </div>
            </v-col>
            <v-col cols="3"> 
                <v-date-picker
                    v-model="datePicker"
                    :first-day-of-week="0"
                    locale="zh-cn"
                    @input="setDateOfDailyReport"
                    class="dayPicker"
                ></v-date-picker>
            </v-col>
        </v-row>
        <div class="line my-8"></div>
        <TabFirstItem v-if="allDailyReport.length != 0" v-for="(rp, index) in allDailyReport" :key="index" :report="rp" :type="re_type" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
        <DailyReportModal ref="dailyReport" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
    </div>
</template>

<script>
import TabFirstItem from '@/components/summary/TabFirstItem.vue';
import DailyReportModal from '@/components/summary/DailyReportModal.vue';
import { constant } from '@/constants/constant.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'TabFirstComponent',
    props: ['year', 'month'],
    data() {
        return {
            re_year: null,
            re_month: null,
            re_day: null,
            re_type: "daily",
            day: null,
            dayOfWeek: 0,
            datePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        }
    },
    created() {
        let today = new Date();
        let day_of_week = constant.dayOfWeek.filter((d) => d.id == today.getDay());
        this.day = today.getDate();
        this.dayOfWeek = day_of_week[0].value;

        this.re_year = this.year;
        if(this.month < 10) {
            this.re_month = "0" + this.month;
        } else {
            this.re_month = this.month;
        }
        if(this.day < 10) {
            this.re_day = "0" + this.day;
        } else {
            this.re_day = this.day;
        }
        let param = {
            "rp_creator" : this.authUser.id,
            "rp_date" : this.re_year + "-" + this.re_month + "-" + this.re_day,
            "rp_type" : 0
        }
        this.getDailyReport(param);
        this.getAllDailyReportWithCreator({"rp_creator" : this.authUser.id, "rp_type" : 0});
    },
    watch : {
        year: function(newValue, oldValue) {
            this.re_year = newValue;
        },
        month: function(newValue, oldValue) {
            if(newValue < 10) {
                this.re_month = "0" + newValue;
            } else {
                this.re_month = newValue;
            }
            let date = new Date(this.re_year + "-" + this.re_month + "-" + this.re_day);
            this.dayOfWeek = constant.dayOfWeek.filter((d) => d.id == date.getDay())[0].value;
            let param = {
                "rp_creator" : this.authUser.id,
                "rp_date" : this.re_year + "-" + this.re_month + "-" + this.re_day,
                "rp_type" : 0,
            }
            this.getDailyReport(param);
        }
    },
    components: {
        TabFirstItem,
        DailyReportModal,
    },
    computed: {
        ...mapGetters('report', ['dailyReport', 'allDailyReport']),
        ...mapGetters('auth', ['authUser']),
    },
    methods: {
        ...mapActions('report', ['getDailyReport', 'getAllDailyReportWithCreator']),
        displayDailyReportModal(prop) {
            this.$refs.dailyReport.displayModal(prop);
        },
        handle_displayRightSummaryEdit(prop) {
            let param = {
                value: prop,
                type: "daily",
            }
            this.$emit("displayRightSummaryEdit", param);
        },
        setDateOfDailyReport(prop) {
            this.day = prop.split("-")[2];
            this.re_day = this.day;
            if(parseInt(this.day) < 10)
            {
                this.day = this.day.split("0")[1];
            }
            let date;
            if(this.month < 10) {
                date = new Date(this.year + "-" + "0" + this.month + "-" + this.day);
            } else {
                date = new Date(this.year + "-" + this.month + "-" + this.day);
            }
            let day_of_week = constant.dayOfWeek.filter((d) => d.id == date.getDay())[0].value;
            this.dayOfWeek = day_of_week;
            let param = {
                "rp_creator" : this.authUser.id,
                "rp_date" : this.re_year + "-" + this.re_month + "-" + this.re_day,
                "rp_type" : 0,
            }
            this.getDailyReport(param);
        }
    }
}
</script>

<style>
.title {
    font-size: 20px;
    line-height: 36px;
    color: #555;
}

.rect {
    border: 1px dotted #ddd;
    text-align: center;
    padding: 30px 0px;
    font-size: 22px;
    color: #c5c5c5;
}

.line {
    border-top: 2px solid #E3ECF1;
}

.report {
    padding: 20px;
}

.w-100 {
    width: 100%;
}

.date-info {
    border-left: 4px solid #2d83cf;
    font-size: 16px;
    color: #2d83cf;
}

.left-line {
    border-left: 6px solid #e3ecf1;
    padding-left: 8px;
    font-size: 16px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
}

.time-fb {
    line-height: 16px;
    color: #ccc;
    font-size: 12px;
}

.action-tag {

}

.summary_intercom {
    cursor: pointer;
}
.summary_intercom:hover .message_icon {
    color: rgb(105 167 206) !important;
}
.summary_intercom:hover span {
    color: rgb(105 167 206);
}
.summary_intercom_p_0 {
    padding: 0px !important;
    transition: all ease 1s;
}
.mtb_15 {
    margin: 15px 0px;
}
.dayPicker .v-picker__title {
    display: none !important;
}
</style>