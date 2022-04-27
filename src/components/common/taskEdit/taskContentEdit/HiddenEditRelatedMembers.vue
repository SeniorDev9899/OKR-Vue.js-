<template>
    <v-layout d-flex align-center justify-start column class="width100 m_0">
        <v-flex class="width100 m_0"><span class="relatedMember_title">相关成员</span></v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout d-flex align-center justify-start row class="width100 m_0">
                <v-flex align-center justify-start class="width_135">
                    <v-layout d-flex align-center justify-center column class="width100 m_0">
                        <v-flex class="width100 m_0"><span class="task_title">发起者</span></v-flex>
                        <v-flex class="width100 m_0">
                            <v-avatar color="#96bf65" size="33" class="mr_20 cursorPointer">{{ relatedTaskCreator | surename }}</v-avatar>
                            <span>{{ relatedTaskCreator | username }}</span>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex align-center justify-start class="attributes_major">
                    <v-layout d-flex align-center justify-center column class="width100 m_0">
                        <v-flex class="width100 m_0"><span class="task_title">负责人</span></v-flex>
                        <v-flex class="width100 m_0">
                            <ToolTipComponent direction="top" :tooltipText="relatedTaskOwner | username">
                                <v-avatar color="#f79c6f" size="33" class="mr_20 cursorPointer">{{ relatedTaskOwner | surename }}</v-avatar>
                            </ToolTipComponent>
                            <span class="mr_15">{{ relatedTaskOwner | username }}</span>
                            <v-menu width="300" offset-y class="attributes_major"> 
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="cursorPointer related_major_pencil" ><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                                </template>
                                <v-sheet>
                                    <UserPicker @pick="setOwner" />
                                </v-sheet>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex class="width100 m_20_0 p_0_6">
            <v-layout d-flex align-start justify-start row class="width100 m_0">
                <v-flex align-center justify-start class="width_55">
                    <v-layout d-flex align-center justify-center column class="width100 m_0 task_approver">
                        <v-flex class="width100 m_0"><span class="task_title">审批人</span></v-flex>
                        <v-flex v-if="!!approver && approver !== -1" class="width100 m_0">
                            <v-avatar color="#79c7b7" size="33" class="mr_20 cursorPointer">{{ relatedTaskApprover | surename }}</v-avatar>
                            <span class="mr_5_task_rel">{{ relatedTaskApprover | username }}</span>
                            <v-icon class="mr_5_task_rel task_relates_approve_remove" @click="removeApprover">mdi-close-circle</v-icon>
                            <v-menu v-if="approverExist" width="300" offset-y class="task_approver"> 
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="cursorPointer related_approver_pencil"><v-icon style="color:#83898F; font-size:14px !important; margin-right:5px;">mdi-pencil</v-icon></span>
                                </template>
                                <v-sheet>
                                    <UserPicker @pick="setApprover" />
                                </v-sheet>
                            </v-menu>
                        </v-flex>
                        <v-flex v-else width100>
                            <v-menu v-if="!approverExist" width="300" offset-y class="task_approver"> 
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on" class="plus">mdi-plus-circle-outline</v-icon>
                                </template>
                                <v-sheet>
                                    <UserPicker @pick="setApprover" />
                                </v-sheet>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex align-center justify-start>
                    <v-layout d-flex align-center justify-center column class="width100 m_0">
                        <v-flex class="width100 m_0"><span class="task_title">参与人</span></v-flex>
                        <v-flex d-flex align-start justify-start row class="width100 m_0">
                            <v-layout v-if="!!collaborators" v-for="(collaborator, index) in relatedTaskCollaborators" :key="index" d-flex align-center justify-center column class="m_0 collaborators_item">
                                <v-flex class="width100 m_0 height_40">
                                    <ToolTipComponent direction="top" :tooltipText="collaborator | username">
                                        <v-avatar color="#f5b168" size="33" class="cursorPointer">{{ collaborator | surename }}</v-avatar>
                                        <span @click="removeTaskCollaborator(collaborator)"><v-icon class="remove_task_collaborator">mdi-close-circle</v-icon></span>
                                    </ToolTipComponent>
                                </v-flex>
                                <v-flex class="width100 m_0"><span style="font-size: 14px;">{{ collaborator | username }}</span></v-flex>
                            </v-layout>
                            <v-layout d-flex align-center justify-center column class="m_0 add_new_member" style="position:relative; top:0px;">                                
                                <v-flex class="width100 m_0">
                                    <v-menu width="300" offset-y> 
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon v-bind="attrs" v-on="on" class="plus">mdi-plus-circle-outline</v-icon>
                                        </template>
                                        <v-sheet>
                                            <UserPicker @pick="setCollaborator" />
                                        </v-sheet>
                                    </v-menu>
                                </v-flex>
                            </v-layout>                             
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import UserPicker from '@/components/common/UserPicker.vue';

export default {
    props: ['creator', 'owner', 'approver', 'collaborators'],
    components: {
        ToolTipComponent,
        UserPicker,
    },
    data() {
        return {
            approverExist: false,
        }
    },
    created() {
        if(!!this.approver && this.approver != -1) {
            this.approverExist = true;
        } else {
            this.approverExist = false;
        }
    },
    watch: {
        approver(v) {
            if(v != -1) {
                this.approverExist = true;
            } else {
                this.approverExist = false;
            }
        }
    },
    computed: {
        relatedTaskCreator() {
            if(!!this.creator)
            {
                return this.creator;
            }
        },
        relatedTaskOwner() {
            if(!!this.owner) 
            {
                return this.owner;
            }
        },
        relatedTaskApprover() {
            if(!!this.approver && this.approver != 0) 
            {
                return this.approver;
            }
        },
        relatedTaskCollaborators() {
            if(!!this.collaborators) 
            {
                return this.collaborators;
            }
        }
    },
    methods: {
        setOwner(prop) {
            this.$emit("setOwner", prop.user.id);
        },
        setApprover(prop) {
            this.approverExist = true;
            this.$emit("setApprover", prop.user.id);
        },
        removeApprover() {
            this.approverExist = false;
            this.$emit("removeApprover");
        },
        setCollaborator(prop) {
            this.$emit("setCollaborator", prop.user.id);
        },
        removeTaskCollaborator(prop) {
            this.$emit("removeCollaborator", prop);
        }
    }
}
</script>

<style>
.relatedMember_title {
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
.plus {
    font-size: 33px !important;
    color: #667580 !important;
    background-color: #e4ebf0;
    border-radius: 50%;
    cursor: pointer;
}
.related_major_pencil {
    position: relative;
    bottom: 2px;
    opacity: 0;
    transition: all ease .5s;
}
.related_approver_pencil {
    position: relative;
    bottom: 2px;
    opacity: 0;
    transition: all ease .5s;
}
.attributes_major:hover .related_major_pencil {
    opacity: 1;
}
.task_approver:hover .related_approver_pencil {
    opacity: 1;
}
.p_0_6 {
    padding: 0px 6px;
}
.task_title {
    color: #83898f;
    font-size: 14px;
}
.mr_20 {
    margin-right: 20px;
}
.width20 {
    width: 20%;
}
.width80 {
    width: 80%;
}
.h_55 {
    height: 55px;
}
.mr_15 {
    margin-right: 15px !important;
}
.add_new_member {
    position: relative;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
}
.pr_20 {
    padding-right: 20px;
}
.width_135 {
    width: 135px;
}
.width_55 {
    width: 55px;
}
.mr_5_task_rel {
    margin-right: 5px;
}
.task_relates_approve_remove {
    color: #bfc3c7;
    opacity: 0;
    transition: all ease .5s;
    font-size: 14px !important;
    border-radius: 50%;
    cursor: pointer;
}
.task_relates_approve_remove:hover {
    color: #f04d4d;
}
.task_approver:hover .task_relates_approve_remove {
    opacity: 1;
}
.remove_task_collaborator {
    transition: all ease .5s !important;
    opacity: 0;
    font-size: 13px !important;
    position: relative !important;
    right: 10px !important;
    bottom: 13px !important;
    color: #76adc8 !important;
    cursor: pointer;
}
.height_40 {
    height: 40px;
}
.collaborators_item {
    width: 0px;
}
.collaborators_item:hover .remove_task_collaborator {
    opacity: 1;
}
.remove_task_collaborator:hover {
    color: #f04d4d !important;
}
</style>