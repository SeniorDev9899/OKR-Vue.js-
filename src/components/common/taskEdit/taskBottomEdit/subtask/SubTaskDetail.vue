<template>
    <v-container class="sub_task_detail">
        <v-layout class="subt_task_detail_basic">
            <v-flex d-flex align-center justify-start>
                <span style="height:100%;display:flex;align-items:center;">目标值 :</span>
                <!-- price -->
                <v-text-field class="input-price subtask_detail_height_100" placeholder="请输入数字" hide-details v-model="subTaskPrice" @input="inputTargetPrice" />
            </v-flex>
            <v-flex>
                <!-- unit -->
                <v-menu offset-y content-class="subtask_unit">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn tile tag="div" class="btn-unit" elevation="0" color="#E0E0E0" v-bind="attrs" v-on="on" height="40">({{ unit[subTaskUnit-1]}})</v-btn>
                    </template>
                    <v-card class="subtask_unit_card">
                        <v-radio-group v-model="subTaskUnit" row hide-details height="40">
                            <v-radio value="1">
                                <template v-slot:label>
                                <span class="text-caption">元</span>
                                </template>
                            </v-radio>
                            <v-radio value="2" style="margin:0px;">
                                <template v-slot:label>
                                <span class="text-caption">个</span>
                                </template>
                            </v-radio>
                        </v-radio-group>
                    </v-card>
                </v-menu>
            </v-flex>
            <v-flex>
                <!-- feedback -->
                <v-menu v-model="subTaskFeedbackMenu" :close-on-content-click="false" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn tile v-bind="attrs" tag="div" elevation="0" class="btn-feedback" width="180" v-on="on" height="40">进展反馈：<span style="width:100px;">{{ cronText }}</span></v-btn>
                    </template>
                    <SetTaskCron @set="setCron" @close="subTaskFeedbackMenu=false" />
                </v-menu>
            </v-flex>
            <v-flex>
                <!-- approver -->
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn tile class="btn-approver" elevation="0" v-bind="attrs" width="150" v-on="on" height="40">管控审批人：<span style="width:60px;">{{ subTaskApprover | username }}</span></v-btn>
                    </template>
                    <v-card>
                        <UserPicker @pick="setApprover" />
                    </v-card>
                </v-menu>
            </v-flex>
            <v-flex>
                <v-btn tile color="primary" text @click="moreInput=!moreInput" width="79" height="40">
                    更多属性<v-icon>mdi-chevron-double-down</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout  v-if="moreInput" class="sub_task_detail_more">
            <v-flex class="more_target">
                <!-- target -->
                <v-menu :close-on-content-click="false" v-model="subTaskTargetMenu" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn tile v-bind="attrs" elevation="0" class="btn-target-parent" tag="div" width="20" v-on="on" height="40">任务关联</v-btn>
                    </template>
                    <MyObjectPicker @pick="inputTarget" />
                </v-menu>
                <span>
                    <v-chip @click:close="removeParent" v-if="!!subTaskParent" label close>{{ getParentName(subTaskParent) }}</v-chip>
                </span>
            </v-flex>
            <v-flex shrink>
                <!-- labels -->
                <span class="label text-subtitle-2">预估工时</span>
                <input class="input-hours" v-model="subTaskWorkEstTime" />
                <span class="label-time text-subtitle-2">(小时)</span>
            </v-flex>
            <v-flex grow>
                <!-- vice leader -->
                <v-menu offset-y content-class="more_viceLeader">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn tile elevation="0" class="btn-viceleader" v-bind="attrs" v-on="on" height="40">代领导发起: <span style="width:90px;">{{ subTaskViceLeader | username }}</span></v-btn>
                    </template>
                    <v-card>
                        <UserPicker @pick="setViceLeader" />
                    </v-card>
                </v-menu>
            </v-flex>
        </v-layout>
        <v-layout v-if="moreInput">
            <v-flex d-flex align-center justify-center shrink><span class="label text-subtitle-2">参与人</span></v-flex>
            <v-flex shrink> 
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" fab small text color="green">
                        <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <UserPicker @pick="addMember" />
                    </v-card>
                </v-menu>
            </v-flex>
            <v-flex>
                <span>
                    <v-avatar style="cursor:pointer;" @click="removeUser(i)" class="white--text mt-2 mx-1" color="orange" size="24" v-for="(user, i) in subTaskCollaborator" :key="i">{{ user | surename }}</v-avatar>
                </span>
            </v-flex>
        </v-layout>
        <v-layout>
            <EditorContent v-model="subTaskDescription" @input="handle_input" />
        </v-layout>
    </v-container>
</template>

<script>
import SetTaskCron from '@/components/common/SetTaskCron.vue';
import UserPicker from '@/components/common/UserPicker.vue';
import MyObjectPicker from '@/components/common/MyObjectPicker.vue';
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';
import { mapGetters } from 'vuex';

export default {
    components: {
        SetTaskCron,
        UserPicker,
        MyObjectPicker,
        EditorContent
    },
    data() {
        return {
            moreInput: false,
            subTaskPrice: null,
            unit: ['元', '个'],
            subTaskUnit: 1,
            subTaskFeedbackTime: null,
            cronText: '',
            subTaskFeedbackMenu: false,
            subTaskApprover: null,            
            subTaskTargetMenu: false,
            subTaskParent: null,
            subTaskWorkEstTime: null,
            subTaskViceLeader: null,
            subTaskCollaborator: [],
            subTaskDescription: null,
            subTaskParentObject: null,
            subtaskParentItem: null,
        }
    },
    computed: {
        ...mapGetters('okr', ['okrObj']),
        ...mapGetters('item', ['items']),
    },
    methods: {
        setCron(e) {
            this.subTaskFeedbackTime = e.value
            this.cronText = e.text
            this.subTaskFeedbackMenu = false
            this.$emit("setCron", {feedbackTime: this.subTaskFeedbackTime, unit: this.subTaskUnit - 1});
        },
        setApprover(e) {
            this.subTaskApprover = e.user.id
            this.$emit("setApprover", this.subTaskApprover);
        },
        inputTarget(e) {
            this.subTaskTargetMenu = false
            this.subTaskParent = e
            this.$emit("setParent", this.subTaskParent);
        },
        getParentName(value) {
            if(Object.keys(value).includes('ob_id')) {
                const index = this.okrObj.findIndex(item => item.ob_id == value.ob_id);
                return `${this.okrObj[index].ob_name.slice(0, 10)}...`
            }else if (Object.keys(value).includes('item_id')) {
                const index = this.items.findIndex(item => item.item_id == value.item_id);
                return `${this.items[index].item_name.slice(0, 10)}...`
            }
        },
        removeParent() {
            this.subTaskParent = null
        },
        setViceLeader(e) {
            this.subTaskViceLeader = e.user.id
            this.$emit("setViceLeader", { viceLeader: this.subTaskViceLeader, estimationTime: this.subTaskWorkEstTime});
        },
        addMember(e) {
            this.subTaskCollaborator.push(e.user.id)
            this.$emit("setTaskCollaborator", this.subTaskCollaborator);
        },
        inputTargetPrice(e) {
            this.$emit("setTargetPrice", e);
        },
        handle_input(e) {
            this.$emit("setDescription", e.prgValue);
        },
        removeUser(index) {
            this.subTaskCollaborator.splice(index, 1);
            this.$emit("removeoneCollaborator", this.subTaskCollaborator);
        },
        onSave() {
            this.subTaskCollaborator = this.subTaskCollaborator.toString()
            this.subTaskDescription = !!this.subTaskDescription ? this.subTaskDescription.prgValue.toString() : ''
            if(!!this.subTaskParent) {
                if(Object.keys(this.subTaskParent).includes('ob_id')) {
                this.subTaskParentObject = this.subTaskParent.ob_id
                } else if (Object.keys(this.subTaskParent).includes('item_id')) {
                this.subtaskParentItem = this.subTaskParent.item_id
                }
            }
            this.$emit('save', this.newTask)
        },
    }   
    
}
</script>

<style>
.sub_task_detail {
    border: 1px solid #a9b8bf;
    border-top: 0px;
    padding: 0px !important;
}
.subtask_detail_height_100 {
    height: 100%;
    padding: 0px;
    margin: 0px;
}
.subtask_unit {
}
.subtask_unit_card .v-input {
    margin:0px;
    padding: 5px;
}
.btn-target-parent {
    background-color: white !important;
}
.subt_task_detail_basic {
    border-bottom: 1px solid #a9b8bf;
    padding-left: 5px;
    padding-right: 5px;
}
.sub_task_detail_more {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #a9b8bf;
    border-top: 0px;
    padding: 0px 5px;
    border-left: 0px;
    border-right: 0px;
}
.more_target {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    border-right: 1px solid #64B5F6;
}
.btn-viceleader {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
</style>