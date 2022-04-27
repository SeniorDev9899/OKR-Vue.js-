<template>
    <v-system-bar fixed height="51" color="white" style="border-bottom:1px solid #907f7f !important;">
        <v-container d-flex align-center justify-start>
            <v-layout row class="width100 m_0">
                <v-flex shrink class="cursorPointer"> 
                    <v-menu offset-y content-class="task_status-menu">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                <v-icon class="squareIcon">{{ taskStatus.icon }}</v-icon>
                                <span class="square_status">{{ taskStatus.text }}</span>
                            </span>
                        </template>
                        <v-list class="status_list">
                            <v-list-item v-for="(status, i) in taskStatusList" :key="i">
                                <v-list-item-title>
                                    <v-btn small small plain @click="selectTaskStatus(status)">
                                        <v-icon class="squareIcon">{{ status.icon }}</v-icon>
                                        <span class="ml-2 square_status">{{ status.text }}</span>
                                    </v-btn>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-flex>
                <v-flex grow d-flex align-center justify-end>
                    <span v-if="!taskTargetPriceExist" class="task_target" @click="showTargetPriceModal"><v-icon size="20" color="#1687d9">mdi-bullseye-arrow</v-icon><span style="font-size:17px;color:#1687d9;">目标值</span></span>
                    <SetTaskTargetPrice ref="targetPrice" />      
                    <ToolTipComponent
                        direction="top"
                        tooltipText="仅相关成员可见"
                    >
                        <span class="right_task_header lock_icon mr_10 cursorPointer" @click="openVisibilityModal(taskVisibleRange)"><v-icon class="m_0 lock">{{ taskVisibleRange.icon }}</v-icon></span>
                    </ToolTipComponent>  
                    <v-menu offset-y content-class="task_status-menu">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on" class="right_task_header alarm_icon mr_10 cursorPointer" :style="{color: `${priority[taskPriority - 1].color}`}">
                                <ToolTipComponent
                                    direction="top"
                                    tooltipText="最高"
                                >
                                    <v-icon class="m_0 alarm" :color="priority[taskPriority - 1].color">mdi-alarm-light-outline</v-icon>
                                    <span class="task_priority_value" :style="{color: `${priority[taskPriority - 1].color}`}">{{ taskPriority }}</span>
                                </ToolTipComponent>
                            </span>
                        </template>
                        <v-list v-model="taskPriority">
                            <v-list-item v-for="(item, i) in [1,2,3,4,5]" :key="i">
                                <v-list-item-title>
                                    <v-btn small small plain @click="selectPriority(item)">
                                        <v-icon class="item_alarm" :color="priority[i].color">mdi-alarm-light-outline</v-icon>
                                        <span class="item_alarm_priority" :style="{color: `${priority[i].color}`}">{{ item}}</span>
                                        <span class="ml-2">{{ priority[i].text }}</span>
                                    </v-btn>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu> 
                    <ToolTipComponent
                        direction="top"
                        tooltipText="打赏"
                    >
                        <span class="right_task_header bitcoin_icon mr_10 cursorPointer"><v-icon class="m_0 bitcoin">mdi-bitcoin</v-icon></span>
                    </ToolTipComponent>
                    <v-divider vertical class="mr_10 "></v-divider>
                    <ConfirmDialogComponent
                       v-on:click="(bool) => confirmClick(bool)"
                       :option="task_remove"
                    >
                        <ToolTipComponent
                            direction="top"
                            tooltipText="删除"
                        >
                            <span class="right_task_header bitcoin_icon mr_10"><v-icon class="m_0 bitcoin delete">mdi-delete-outline</v-icon></span>
                        </ToolTipComponent>
                    </ConfirmDialogComponent>
                    <v-icon class="close cursorPointer" @click="closeTaskEditor">mdi-close</v-icon>
                </v-flex>
            </v-layout> 
        </v-container>
        <VisibilityModal ref="visibility" @setVisibleRange="handle_setVisibleRange" />        
    </v-system-bar>
</template>

<script>
import ConfirmDialogComponent from '@/components/okrgoal/shared/ConfirmDialogComponent.vue';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import VisibilityModal from './VisibilityModal.vue';
import SetTaskTargetPrice from './SetTaskTargetPrice.vue';
import { constant } from '@/constants/constant.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['content'],
    data() {
        return {
            task_remove: "task_remove",
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
            taskStatus: {
                text: "未开始",
                icon: "mdi-checkbox-blank-outline",
            },
            taskStatusList: null,
            taskPriority: 1,
        }
    },
    created() {
        this.taskStatusList = constant.taskStatus;
    },
    components: {
        ConfirmDialogComponent,
        ToolTipComponent,
        VisibilityModal,
        SetTaskTargetPrice
    },
    watch: {
        content(v) {
            let taskStatus = constant.taskStatus.filter((f) => f.value == v.task_status)[0];
            this.taskStatus = taskStatus;
            // let taskVisible;
            // if(!!v.task_visible_type) {
            //     taskVisible = constant.taskVisibility.filter((f) => f.value == v.task_visible_type)[0];
            //     this.taskVisible = taskVisible;
            // }
            this.taskPriority = v.task_priority;
        }
    },
    computed: {
        taskTargetPriceExist() {
            if(!!this.content) {
                if(!!this.content.task_target_price) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        taskVisibleRange() {
            if(!!this.content.task_visible_type) {
                let taskInfo = constant.taskVisibility.filter((f) => f.value == this.content.task_visible_type)[0];
                return taskInfo;
            } else {
                let taskInfo = {
                    text: '公开',
                    value: 0,
                    icon: "mdi-lock-open"
                };
                return taskInfo;
            }
        }
    },
    methods: {
        ...mapActions('task', ['updateTaskOne', 'deleteTaskOne']),
        confirmClick(prop) {
            if(prop == true) {
                this.deleteTaskOne({ "task_id" : this.content.task_id });
                this.$emit("closeTaskEditor");
            }
        },
        openVisibilityModal(prop) {
            this.$refs.visibility.openVisibility(prop);
        },
        closeTaskEditor() {
            this.$emit("closeTaskEditor");
        },
        selectPriority(prop) {
            this.taskPriority = prop;
            this.updateTaskOne({'task_id' : this.content.task_id, 'task_parent_object' : this.content.task_parent_object, 'task_priority' : prop});
            this.$emit("selectPriority", prop);
        },
        selectTaskStatus(prop) {
            this.updateTaskOne({'task_id' : this.content.task_id, 'task_parent_object' : this.content.task_parent_object, 'task_status' : prop.value});
            this.taskStatus = prop;
        },
        handle_setVisibleRange(prop) {
            this.updateTaskOne({'task_id' : this.content.task_id, 'task_parent_object' : this.content.task_parent_object, 'task_visible_type' :  prop.value});
        },
        showTargetPriceModal() {
            this.$refs.targetPrice.show({'task_id' : this.content.task_id, 'task_parent_object' : this.content.task_parent_object});
        }
    }
}
</script>

<style scoped>
.width100 {
    width: 100%;
}
.m_0 {
    margin: 0px;
}
.cursorPointer {
    cursor: pointer;
}
.squareIcon {
    color: #1687d9 !important;
    font-size: 20px !important;
    font-weight: 400;
    position: relative;
    bottom: 2px;
}
.square_status {
    font-size: 17px;
    color: #83898f;
}
.right_task_header {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
.lock_icon {
    border: 1px solid #a9b8bf;
}
.alarm_icon {
    border: 1px solid;
}
.bitcoin_icon {
    border: 1px solid #a9b8bf;
}
.lock {
    color: #FFAB24 !important;
    font-size: 18px !important; 
}
.delete {
    color: #4c5d68 !important;
}
.alarm {
    font-size: 23px !important;
    position: relative !important;
    left: 3px !important;
    top: 10px !important;
}
.item_alarm_priority {
    position: relative;
    right: 17px;
}
.item_alarm {
    font-size: 26px;
}
.task_priority_value {
    position: relative !important;
    left: 11px !important;
    bottom: 13px !important;
    font-size: 11px !important;
    font-weight: bold !important;
}
.bitcoin {
    color: #909497 !important;
    font-size: 18px !important; 
}
.bitcoin_icon:hover {
    border: 2px solid #e36f0c !important;
}
.bitcoin_icon:hover .bitcoin {
    color: #e86650 !important;
}
.close {
    color: #647481 !important;
    font-size: 30px !important;
    width: 30px; height: 30px;
}
.mr_10 {
    margin-right: 10px;
}
.close:hover {
    color: red !important;
}
.task_status-menu {
    z-index: 14 !important;
}
.status_list .v-list-item {
    padding: 0px 3px;
}
.status_list .v-list-item .v-list-item__title button {
    padding: 0px 3px;
}
.task_target {
    border-width: 2px!important;
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 10px;
    border-left: 2px solid rgb(232 221 221);
    border-right: 2px solid rgb(232 221 221);
    padding: 0px 10px;
    cursor: pointer;
}
</style>