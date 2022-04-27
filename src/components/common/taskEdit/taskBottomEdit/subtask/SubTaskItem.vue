<template>
<v-sheet>
    <v-container class="width100 m_0 subtask_item">
        <v-layout>
            <v-flex d-flex shrink class="subtask_mr_5">
                <ToolTipComponent direction="top" tooltipText="进行中">
                    <v-icon class="subtask-sand-timer">{{ subTaskStatus }}</v-icon>
                </ToolTipComponent>
            </v-flex>
            <v-flex grow>
                <v-layout d-flex align-center justify-start row class="width100 m_0">
                    <v-flex shrink class="subtask_mr_35" @click="showSubTaskEditor">
                        <ToolTipComponent direction="top" :tooltipText="subTaskName">
                            <span class="subtask_name">{{ subTaskName }}</span>
                        </ToolTipComponent>
                    </v-flex>
                    <v-flex grow>
                        <span class="subtask_desc">定量任务</span>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex shrink class="subtask_end_date">{{ subTaskStartDate.split("-")[1] + "/" + subTaskEndDate.split("-")[2] }}</v-flex>
            <v-flex shrink class="subtask_owner">{{ subTaskOwner | username }}</v-flex>
            <v-flex shrink class="subtask_priority"><v-icon class="subtask_alarm" :style="{color: `${priority[subTaskPriority - 1].color}`}">mdi-alarm-light-outline</v-icon><span class="subtask_priority_value" :style="{color: `${priority[subTaskPriority - 1].color}`}">{{ subTaskPriority }}</span></v-flex>
            <ConfirmDialogComponent
                v-on:click="(bool) => confirmClick(bool)"
                :option="task_subtask"
            >
                <v-flex shrink class="subtask_delete"><span class="delete">删除</span></v-flex>
            </ConfirmDialogComponent>
        </v-layout>
        <!-- <v-layout class="subtask_item_edit"><v-flex shrink style="margin-right:10px;"><v-icon>mdi-checkbox-marked-outline</v-icon><span class="edit-value">0/1</span></v-flex><v-flex><v-icon>mdi-square-edit-outline</v-icon><span class="edit-value">1</span></v-flex></v-layout> -->
    </v-container>
    <v-divider></v-divider>
</v-sheet>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import ConfirmDialogComponent from '@/components/okrgoal/shared/ConfirmDialogComponent.vue';
import { constant } from '@/constants/constant.js';
import { mapActions } from 'vuex';

export default {
    props: ['task_id', 'content'],
    data() {
        return {
            priority: [
                {
                    text: '最高',
                    color: 'red'
                },
                {
                    text: '高',
                    color: 'yellow'
                },
                {
                    text: '中',
                    color: 'blue'
                },
                {
                    text: '低',
                    color: 'green'
                },
                {
                    text: '非常低',
                    color: 'gray'
                },
            ],
            task_subtask: "subtask",
        }
    },
    components: {
        ConfirmDialogComponent,
        ToolTipComponent,
    },
    computed: {
        subTaskId() {
            if(!!this.content) {
                return this.content.task_id;
            }
        },
        subTaskName() {
            if(!!this.content) {
                return this.content.task_name;
            }
        },
        subTaskStartDate() {
            if(!!this.content) {
                return this.content.task_start_date;
            }
        },
        subTaskEndDate() {
            if(!!this.content) {
                return this.content.task_end_date;
            }
        },
        subTaskPriority() {
            if(!!this.content) {
                return this.content.task_priority;
            }
        },
        subTaskOwner() {
            if(!!this.content) {
                return this.content.task_owner;
            }
        },
        subTaskStatus() {
            if(!!this.content) {
                return constant.taskStatus.filter((t) => t.value == this.content.task_status)[0].icon;
            }
        }
    },
    methods: {
        ...mapActions('task', ['deleteSubTask']),
        confirmClick(prop) {
            if(prop == true) {
                this.deleteSubTask({ "task_id" : this.subTaskId });
            }
        },
        showSubTaskEditor() {
            this.$emit("showSubTaskEditor", this.subTaskId);
        }
    }
}
</script>

<style>
</style>