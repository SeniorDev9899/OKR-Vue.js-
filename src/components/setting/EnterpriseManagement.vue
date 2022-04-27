<template>
    <v-sheet>
        <v-tabs v-model="tab" icons-and-text height="48">
            <v-tabs-slider width="124"></v-tabs-slider>
            <v-tab href="#tab-1">
                项目
            </v-tab>
            <v-tab href="#tab-2">
                目标
            </v-tab>
            <v-tab href="#tab-3">
                计划
            </v-tab>
            <v-tab href="#tab-4">
                日报
            </v-tab>
            <v-tab href="#tab-5">
                周报
            </v-tab>
            <v-tab href="#tab-6">
                月报
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="py-4 px-4">
            <v-tab-item id="tab-1">
                
            </v-tab-item>
            <v-tab-item id="tab-2">
                <v-layout class="d-flex justify-start align-center">
                    <span class="mr-3">开启部门目标规定设置</span>
                    <span><v-switch v-model="enterpriseSetting.goal.departmentTarget"></v-switch></span>
                </v-layout>
                <v-layout>
                    <div class="partTitle">
                        <span class="left mr-2">目标周期设置</span>
                        <span class="right">(季度或月度至少开启一项）</span>
                    </div>
                </v-layout>
                
                <v-layout class="d-flex justify-start align-center">
                    <span class="mr-3">年度</span>
                    <span class="mr-6"><v-switch v-model="enterpriseSetting.goal.periodYear" @click="periodFilter('periodYear')"></v-switch></span>
                    <span class="mr-3">季度</span>
                    <span class="mr-6"><v-switch v-model="enterpriseSetting.goal.periodQuater" :disabled="enterpriseSetting.goal.periodQuater && !enterpriseSetting.goal.periodMonth" @click="periodFilter('periodQuater')"></v-switch></span>
                    <span class="mr-3">月度</span>
                    <span class="mr-6"><v-switch v-model="enterpriseSetting.goal.periodMonth" :disabled="!enterpriseSetting.goal.periodQuater && enterpriseSetting.goal.periodMonth" @click="periodFilter('periodMonth')"></v-switch></span>
                </v-layout>
                <v-layout>
                    <div class="partTitle">
                        <span class="left mr-2">设置目标进度反馈提醒</span>
                        <span class="right">(设置后将自动提醒所有目标负责人更新目标进度进展)</span>
                    </div>
                </v-layout>
                <v-layout class="d-flex justify-start align-center">
                    <span class="mr-3">开启目标进度提醒</span>
                    <span><v-switch v-model="enterpriseSetting.goal.targetProgress"></v-switch></span>
                </v-layout>
            </v-tab-item>
            <v-tab-item id="tab-3">
                
            </v-tab-item>
            <v-tab-item id="tab-4">
                
            </v-tab-item>
            <v-tab-item id="tab-5">
                
            </v-tab-item>
            <v-tab-item id="tab-6">
                
            </v-tab-item>
        </v-tabs-items>
    </v-sheet>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'EnterpriseManagement',
    data() {
        return {
            tab: null,
        }
    },
    computed: {
        enterpriseSetting: {
            get() {
                let filterSetting = this.$store.getters["app/filterSetting"];
                return filterSetting.enterprise;
            },
            set(newValue) {
                
            }
        }
    },
    mounted() {
        this.getSettings();
    },
    methods: {
        ...mapActions('app', ['setPeriodFilter', 'getSettings']),
        periodFilter: function(param) {
            let obj = this.enterpriseSetting;
            this.setPeriodFilter(obj);
        }
    }
}
</script>

<style scoped>
    .partTitle {
        border-left: 2px solid #2dab92;
        border-radius: 2px;
        background-color: #f5f8fa;
        padding: 5px 10px;
        width: 100%;
    }

    .partTitle .left {
        color: #3e4e59;
        font-size: 14px;
    }

    .partTitle .right {
        color: #8f9ca6;
        font-size: 12px;
    }
</style>