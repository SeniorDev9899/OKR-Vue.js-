<template>
    <v-container d-flex class="width100 p_0 summary_monthly">
        <v-layout align-start justify-start row class="width100 m_0">
            <v-flex grow>
                <v-container d-flex class="width100">
                    <v-layout align-start justify-start column class="width100 m_0">
                        <v-flex d-flex align-center justify-start class="width100">
                            <span class="monthly_title">我的周报</span>
                            <span v-if="!setMonthManul" class="monthly_value">{{ year }}年{{ month }}月</span>
                            <span v-else class="monthly_value">{{ year }}年{{ manu_month }}月</span>
                        </v-flex>
                        <v-flex d-flex align-center justify-start class="width100">
                            <v-btn v-if="!!monthlyReport" color="primary" class="mt_20" @click="displayMonthlyReportModal({edit: true, rp: monthlyReport})">写月报</v-btn>
                            <v-btn v-else color="primary" class="mt_20" @click="displayMonthlyReportModal({edit: false})">编辑日报</v-btn>
                        </v-flex> 
                        <v-flex v-if="!!monthlyReport" d-flex align-center justify-start class="width100 mt_30">
                            <TabFirstItem :report="monthlyReport" :type="re_type" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
                        </v-flex>
                        <v-flex v-else d-flex align-center justify-start class="width100 mt_30 empty_monthly_summary">
                            <span class="width100 empty_contain">
                                <p>您尚未提交当月月报</p>
                                <p>总结工作更有助于效率提升哦~</p>
                            </span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
            <v-flex shrink>
                <v-date-picker
                    v-model="datePicker"
                    type="month"
                    locale="zh-cn"
                    @input="setDateOfMonthlyReport"
                    class="monthPicker"
                ></v-date-picker>
            </v-flex>
        </v-layout>
        <v-divider class="width100"></v-divider>
        <TabFirstItem v-if="allMonthlyReport.length != 0" v-for="(rp, index) in allMonthlyReport" :key="index" :report="rp" :type="re_type" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
        <MonthlyReportModal ref="monthlyReport" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
    </v-container>
</template>

<script>
import TabFirstItem from '@/components/summary/TabFirstItem.vue';
import MonthlyReportModal from '@/components/summary/MonthlyReportModal.vue';
import { constant } from '@/constants/constant.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['year', 'month'],
    data() {
        return {
            re_year: null,
            re_month: null,
            re_type: "monthly",
            datePicker: new Date().toISOString().substr(0, 7),
            setMonthManul: false,
            manu_month: null,
        }
    },
    created() {
        this.re_year = this.year;
        if(this.month < 10) {
            this.re_month = "0" + this.month;
        } else {
            this.re_month = this.month;
        }
        let param = {
            "rp_creator" : this.authUser.id,
            "rp_date" : this.re_year + "-" + this.re_month,
            "rp_type" : 2,
        }
        this.getMonthlyReport(param);
        this.getAllMonthlyReportWithCreator({"rp_creator" : this.authUser.id, "rp_type" : 2});
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
                "rp_date" : this.re_year + "-" + this.re_month,
                "rp_type" : 2,
            }
            this.getMonthlyReport(param);
        }
    },
    components: {
        MonthlyReportModal,
        TabFirstItem,
    },
    computed: {
        ...mapGetters('report', ['monthlyReport', 'allMonthlyReport']),
        ...mapGetters('auth', ['authUser']),
    },
    methods: {
        ...mapActions('report', ['getMonthlyReport', 'getAllMonthlyReportWithCreator']),
        setDateOfMonthlyReport(prop) { 
            this.setMonthManul = true;
            this.re_month = prop.split("-")[1];
            if(this.re_month < 10)
            {
                this.manu_month = this.re_month.split("0")[1];
            } else {
                this.manu_month = this.re_month;
            }
            let param = {
                "rp_creator" : this.authUser.id,
                "rp_date" : this.re_year + "-" + this.re_month,
                "rp_type" : 2,
            }
            this.getMonthlyReport(param);
        },
        handle_displayRightSummaryEdit(prop) {
            let param = {
                value: prop,
                type: "monthly",
            }
            this.$emit("displayRightSummaryEdit", param);
        },
        displayMonthlyReportModal(prop) {
            this.$refs.monthlyReport.displayMonthlyReportModal(prop);
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
.monthly_title {
    font-size: 20px !important;
    color: #555 !important;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif !important;
    margin-right: 10px;
}
.monthly_value {
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
.summary_monthly {
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.empty_monthly_summary {
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
.monthPicker .v-picker__title{
    display: none !important;
} 
</style>