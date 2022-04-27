<template>
    <v-layout align-center justify-start column class="width100 m_0_12 p_0_8">
        <v-flex d-flex class="width100 p_0_5">
            <v-layout align-center justify-start row class="width100 m_0">
                <v-flex shrink class="task_progress"><v-icon class="task_progress_icon">mdi-progress-clock</v-icon><span class="task_progress_title">任务进度</span></v-flex>
                <v-flex grow class="task_progress_linear">
                    <v-progress-linear color="light-blue" height="10" striped :value="taskProgress"></v-progress-linear>
                </v-flex>
                <v-flex shrink>
                    <ToolTipComponent v-if="!manualSet" direction="top" tooltipText="任务进行中">
                        <span class="task_sprogress_value">{{ taskProgress }} %</span>
                    </ToolTipComponent>
                    <span v-else class="task_progress_value"><v-text-field v-model="taskProgress" type="number" @keyup.enter="setTaskProgress" hide-details class="task_manual_set"></v-text-field>%</span>
                </v-flex>
                <v-flex v-if="targetPriceExist" shrink><span class="task_progress_value">（不可编辑，系统根据实际值自动计算任务进度）</span></v-flex>
                <v-flex v-else grow class="edit_task_progress">
                    <ToolTipComponent direction="top" tooltipText="编辑任务进度">
                        <span class="cursorPointer" :class="manualSet ? 'displayNone' : ''" style="margin-left: 10px;" @click="setTaskProgressManual"><v-icon class="est_pencil">mdi-pencil</v-icon></span>
                    </ToolTipComponent>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex d-flex class="width100 p_0_5 mt_10 task_feedback">
            <v-layout align-center justify-start row class="width100 m_0">
                <v-flex shrink class="task_feedback_time"><v-icon class="task_feedback_time_icon">mdi-alarm</v-icon><span class="task_feedback_title">反馈时间</span></v-flex>
                <v-flex grow class="mr_25">
                    <span class="task_feeback_value mr_15">{{ taskFeedbackTime }}</span>
                    <v-menu v-model="feedbackMenu" offset-y :close-on-content-click="false" content-class="custom_feedback">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on" class="cursorPointer"><v-icon class="feedback_pencil">mdi-pencil</v-icon></span>
                        </template>
                        <SetTaskCron @set="setCron" @close="feedbackMenu=false" />
                    </v-menu>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex d-flex class="width100 p_0_5 mt_10 task_estimation">
            <v-layout align-center justify-start row class="width100 m_0">
                <v-flex shrink class="task_est_time"><v-icon class="task_est_time_icon">mdi-timer-outline</v-icon><span class="task_feedback_title">预估工时</span></v-flex>
                <v-flex d-flex align-center justify-start shrink class="mr_25" style="width:170px;">
                    <span v-if="!editEst" class="task_est_value mr_5_est">{{ taskEstimationTime }}</span>
                    <v-text-field v-if="editEst" class="est_time_edit" hide-details v-model="estimation" v-on:keyup.enter="submitChangedEstTime" v-click-outside="disableEditEstTime"></v-text-field>
                    <span v-if="editEst" class="mr_15" style="color:#83898F;">（小时）</span>
                    <ToolTipComponent direction="top" tooltipText="编辑">
                        <span class="cursorPointer" @click="editEstimationTime"><v-icon class="est_pencil">mdi-pencil</v-icon></span>
                    </ToolTipComponent>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import SetTaskCron from '@/components/common/SetTaskCron.vue';
import { mapActions } from 'vuex'; 

export default {
    props: ['task_id', 'task_progress', 'task_parent_object', 'target_price', 'real_price', 'feedbackTime', 'estTime'],
    components: {
        ToolTipComponent,
        SetTaskCron,
    },
    data() {
        return {
            editEst: false,
            changedEstimationTime: null,
            feedbackMenu: false,
            targetPriceExist: null,
            manualSet: false,
            prgValue: null,
            estimation: 0,
        }
    },
    created() {
        this.editEst = false;
    },
    computed: {
        taskProgress: {
            get: function() {
                if(!!this.target_price && !!this.real_price)
                {
                    this.targetPriceExist = true;
                    return Math.ceil((this.real_price/this.target_price) * 100);
                } else if(!!this.target_price && !this.real_price)
                {
                    this.targetPriceExist = true;
                    return 0;
                } else {
                    this.targetPriceExist = false;
                    if(!this.task_progress) {
                        return 0;
                    } else {
                        return this.task_progress;
                    }
                }
            },
            set: function(newValue) {
                this.prgValue = newValue;
            }
        },
        taskFeedbackTime() {
            if(!!this.feedbackTime)
            {
                return this.feedbackTime;
            } else {
                return "设置反馈时间";
            }
        },
        taskEstimationTime() {
            return this.estTime;
        }
    },
    methods: {
        ...mapActions('task', ['updateTaskOne']),
        editEstimationTime() {
            this.editEst = true;
            if(isNaN(this.estTime) == true) {
                this.estimation = 0;
            } else {
                this.estimation = this.estTime;
            }
        },
        submitChangedEstTime() {
            this.$emit("setEstTime", this.estimation);
            this.editEst = false;
        },
        setCron(e) {
            this.$emit("setFeedbackTime", e.value);
            this.feedbackMenu = false;
        },
        setTaskProgressManual() {
            this.manualSet = true;
        },
        setTaskProgress() {
            this.updateTaskOne({
                'task_id' : this.task_id,
                'task_parent_object' : this.task_parent_object,
                'task_progress' : this.prgValue,
            })
            this.manualSet = false;
        },
        disableEditEstTime() {
            this.editEst = false;
        }
    }
}
</script>

<style>
.p_0_5 {
    padding: 0px 5px;
}
.task_progress {
    margin-right: 30px;
}
.task_feedback_time {
    margin-right: 30px;
}
.task_est_time {
    margin-right: 30px;
}
.task_progress_icon {
    color: #83898F !important;
    font-size: 14px !important;
    margin-right: 7px;
    position: relative;
    bottom: 0px;
}
.task_feedback_time_icon {
    color: #83898F !important;
    font-size: 14px !important;
    margin-right: 7px;
    position: relative;
    bottom: 0px;
}
.task_est_time_icon {
    color: #83898F !important;
    font-size: 14px !important;
    margin-right: 7px;
    position: relative;
    bottom: 0px;
}
.task_progress_title {
    color: #83898F;
    font-size: 12px;
}
.task_feedback_title {
    color: #83898F;
    font-size: 12px;
}
.task_progress_value {
    color: #83898F;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.task_feeback_value {
    color: #83898F;
    font-size: 16px;
}
.task_est_value {
    color: rgb(208, 162, 248);
    font-size: 16px;
}
.task_progress_linear {
    margin-right: 25px;
}
.feedback_pencil {
    font-size: 12px !important;
    padding: 2px;
    border-radius: 4px;
    opacity: 0;
    transition: all ease .5s;
}
.task_feedback:hover .feedback_pencil {
    background: rgb(213 233 234);
    opacity: 1;
}
.est_pencil {
    font-size: 12px !important;
    padding: 2px;
    border-radius: 4px;
    opacity: 0;
    transition: all ease .5s;
}
.est_time_edit {
    width: 50px !important;
    margin-right: 10px !important;
    margin: 0px;
    padding: 0px;
}
.task_estimation:hover .est_pencil {
    background: rgb(213 233 234);
    opacity: 1;
}

.mr_25 {
    margin-right: 25px;
}
.mr_15 {
    margin-right: 15px;
}
.mr_5_est {
    margin-right: 5px;
}
.custom_feedback {
    min-width: 16px !important;
    top: 362px !important;
    transform-origin: left top !important;
    z-index: 15 !important;
    width: 615px !important;
}
.edit_task_progress:hover .est_pencil {
    background: rgb(213 233 234);
    opacity: 1;
}
.task_manual_set {
    margin: 0px !important;
    padding: 0px !important;
    width: 45px;
}
.displayNone {
    display: none !important;
}
</style>