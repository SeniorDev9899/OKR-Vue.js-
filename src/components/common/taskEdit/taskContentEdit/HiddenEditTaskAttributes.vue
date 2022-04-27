<template>
    <v-layout d-flex align-center justify-start column class="width100 m_0">
        <v-flex class="width100 m_0"><span class="taskAttributes_title">任务属性</span></v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout align-center justify-start row class="width100 m_0 task_attribute_work">
                <v-flex shrink class="mr_35"><v-icon class="attribute_icon">mdi-notebook-outline</v-icon><span class="attribute_title">母任务</span></v-flex>
                <v-flex shrink class="mr_15">
                    <ToolTipComponent direction="top" tooltipText="只有发起人和负责人可以编辑母任务">
                        <span class="task_attribute_work_title">暂无母任务</span>
                    </ToolTipComponent>
                </v-flex>
                <v-flex>
                    <ToolTipComponent direction="top" tooltipText="编辑母任务">
                        <span class="cursorPointer task_attribute_work_pencil"><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                    </ToolTipComponent>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout align-center justify-start row class="width100 m_0 task_attribute_contact_work">
                <v-flex shrink class="mr_35"><v-icon class="contact_icon">mdi-dots-square</v-icon><span class="contact_title">任务关联</span></v-flex>
                <v-flex shrink class="mr_5_task_att">
                    <v-icon v-if="!!taskConnectedWork && taskConnectedWork.id != 0" class="task_contact_work_target_icon">mdi-target</v-icon>
                    <ToolTipComponent direction="top" tooltipText="OKR 333">
                        <span v-if="taskConnectedWork.parent == 0" class="task_contact_work_title">{{ taskConnectedWork.id }}</span>
                        <span v-if="taskConnectedWork.parent == 1" class="task_contact_work_title">{{ taskConnectedWork.id }}</span>
                    </ToolTipComponent>
                    <span v-if="!taskConnectedWork || taskConnectedWork.id == 0" class="taskConnectedWork_notExist">公开</span>
                </v-flex>
                <v-flex v-if="!!taskConnectedWork && taskConnectedWork.id != 0" shrink class="mr_5_task_att">
                    <ToolTipComponent direction="top" tooltipText="清空所选">
                        <v-icon class="task_contact_work_remove" @click="removeTaskConnectedWork">mdi-close-circle</v-icon>
                    </ToolTipComponent>
                </v-flex>
                <v-flex>
                    <ToolTipComponent direction="top" tooltipText="编辑">
                        <span class="cursorPointer task_contact_work_pencil"><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                    </ToolTipComponent>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout align-center justify-start row class="width100 m_0 task_attribute_rest">
                <v-flex shrink class="mr_35"><v-icon class="rest_icon">mdi-link-variant</v-icon><span class="rest_title">关联其他</span></v-flex>
                <v-flex shrink class="mr_15">
                    <span class="task_rest_work_title">暂无</span>
                </v-flex>
                <v-flex>
                    <v-menu :close-on-content-click="false" v-model="targetMenu" offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on" class="cursorPointer task_rest_work_pencil"><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                        </template>
                        <MyObjectPicker @pick="inputTarget" />
                    </v-menu>
                </v-flex>                
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import MyObjectPicker from '@/components/common/MyObjectPicker.vue';

export default {
    props: ['connectedWork'],
    data() {
        return {
            targetMenu: false,
            restTaskSheet: null,
        }
    },
    components: {
        ToolTipComponent,
        MyObjectPicker,
    },
    computed: {
        taskConnectedWork() {
            if(!!this.connectedWork)
            {
                return this.connectedWork;
            }
        }
    },
    methods: {
        removeTaskConnectedWork() {
            this.$emit("removeConnectedWork");
        },
        inputTarget(e) {
            this.targetMenu = false;
            this.restTaskSheet = e;
        },        
    }
}
</script>

<style>
.taskAttributes_title {
    position: relative;
    right: 19px;
    width: 175px;
    height: 26px;
    font-size: 14px;
    color: #565e66;
    background: #fbf2df;
    border-radius: 0 15px 15px 0;
    text-align: center;
    padding: 10px 10px 10px 10px;
}
.attribute_icon {
    color: #83898f;
    font-size: 14px !important;
    margin-right: 5px;
}
.contact_icon {
    color: #83898f;
    font-size: 14px !important;
    margin-right: 5px;
}
.rest_icon {
    color: #83898f;
    font-size: 14px !important;
    margin-right: 5px;
}
.attribute_title {
    font-size: 13px; 
    color: #83898f;
}
.contact_title {
    font-size: 13px; 
    color: #83898f;
}
.rest_title {
    font-size: 13px; 
    color: #83898f;
}
.mr_35 {
    margin-right: 35px;
}
.mr_15 {
    margin-right: 15px;
}
.mr_5_task_att {
    margin-right: 5px;
}
.task_attribute_work_pencil {
    opacity: 0;
    transition: all ease .5s;
    position: relative;
    bottom: 1px;
}
.task_contact_work_pencil {
    opacity: 0;
    transition: all ease .5s;
    position: relative;
    bottom: 1px;
}
.task_rest_work_pencil {
    opacity: 0;
    transition: all ease .5s;
    position: relative;
    bottom: 1px;
}
.task_attribute_rest:hover .task_rest_work_pencil {
    opacity: 1;
}
.task_attribute_work:hover .task_attribute_work_pencil {
    opacity: 1;
}
.task_attribute_work_title {
    font-size: 14px;
    color: #9DA0A3;
}
.task_contact_work_title {
    font-size: 14px;
    color: #9DA0A3;
}
.task_rest_work_title {
    font-size: 14px;
    color: #9DA0A3;
}
.task_contact_work_target_icon {
    color: #83ba5a !important;
    font-size: 18px !important;
    cursor: pointer;
}
.task_contact_work_remove {
    color: #bfc3c7;
    opacity: 0;
    transition: all ease .5s;
    font-size: 14px !important;
    border-radius: 50%;
    cursor: pointer;
}
.task_attribute_contact_work:hover .task_contact_work_remove {
    opacity: 1;
}
.task_contact_work_remove:hover {
    color: #f04d4d;
}
.task_attribute_contact_work:hover .task_contact_work_pencil {
    opacity: 1;
}
.taskConnectedWork_notExist {
    color: #3A4247;
    font-size: 16px;
}
</style>