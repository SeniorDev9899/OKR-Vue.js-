<template>
    <v-layout align-center justify-start column class="width100 m_20_0 p_0_8">
        <v-sheet class="width100 height_100 p_5_10 d_flex_quantify quantifyEdit">
            <v-flex d-flex align-center justify-start class="width100 ptb_5">
                <v-layout class="width100 m_0" d-flex align-center justify-start row>
                    <v-flex grow><v-icon style="color:#106ecc;font-size:16px;margin-right:5px;">mdi-bullseye-arrow</v-icon><span class="font_family" style="color:#106ecc;font-size:13px;">量化</span></v-flex>
                    <ConfirmDialogComponent
                       v-on:click="(bool) => confirmClick(bool)"
                       :option = "task"
                    >
                        <v-flex shrink><v-icon class="cursorPointer" style="color:#bfc3c7;font-size:16px;">mdi-delete-outline</v-icon></v-flex>
                    </ConfirmDialogComponent>
                </v-layout>
            </v-flex>
            <v-flex class="width100 horizontal_divider"></v-flex>
            <v-flex class="width100 pt_10">
                <v-layout class="width100 m_0" d-flex align-center justify-start row>
                    <v-flex d-flex align-center justify-start class="editTarget">
                        <span class="quantify_title">目标值</span>
                        <span v-if="!editTarget" class="quantify_value">{{ targetPrice }}</span>
                        <v-text-field v-if="editTarget" class="edit_target_price" hide-details v-model="targetPrice" v-on:keyup.enter="submitChangedTargetPrice"></v-text-field>
                        <ToolTipComponent direction="top" tooltipText="编辑">
                            <span class="cursorPointer mr_5" @click="editTargetPrice"><v-icon class="quanity_edit_pencil">mdi-pencil</v-icon></span>
                        </ToolTipComponent>
                        <span class="unit" @click="displayUnitModal"><span class="unit_value">({{unit[taskUnit-1].value}})</span><v-icon class="down_icon">mdi-menu-down</v-icon></span>
                        <UnitModal ref="unit" @unitSubmit="handle_unitSubmit" />
                    </v-flex>
                    <v-flex d-flex align-center justify-start class="editTarget">
                        <span class="quantify_title">实际值</span>
                        <span v-if="!editReal" class="quantify_value">{{ realPrice }}</span>
                        <v-text-field v-if="editReal" class="edit_target_price" hide-details v-model="realPrice" v-on:keyup.enter="submitChangedRealPrice"></v-text-field>
                        <ToolTipComponent direction="top" tooltipText="编辑">
                            <span class="cursorPointer mr_5" @click="editRealPrice"><v-icon class="quanity_edit_pencil">mdi-pencil</v-icon></span>
                        </ToolTipComponent>
                        <span class="unit" @click="displayUnitModal"><span class="unit_value">({{unit[taskUnit-1].value}})</span><v-icon class="down_icon">mdi-menu-down</v-icon></span>
                        <UnitModal ref="unit" @unitSubmit="handle_unitSubmit" />
                    </v-flex>
                    <v-flex d-flex align-center justify-end class="quantifyCollapse" @click="showTaskOperators">
                        <span class="collapse_title">展开记录</span>
                        <v-icon class="collapse_icon" :class="task_operators ? 'collapse_icon_rotate' : ''">mdi-chevron-down</v-icon>
                    </v-flex>
                    <v-flex v-if="task_operators" class="width100 horizontal_divider"></v-flex>
                    <v-flex v-if="task_operators" d-flex align-center justify-end>
                        <v-container class="width100">
                            <v-layout class="width100 m_0"><Operating :task_id="taskID" /></v-layout>
                        </v-container>
                    </v-flex>                    
                </v-layout>
            </v-flex>
        </v-sheet>
    </v-layout>
</template>

<script>
import UnitModal from '@/components/common/taskEdit/taskContentEdit/UnitModal.vue';
import Operating from '@/components/okrgoal/rightInfo/interactive/operating/Operating.vue';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';
import ConfirmDialogComponent from '@/components/okrgoal/shared/ConfirmDialogComponent.vue';
import { mapActions } from 'vuex';

export default {
    props: ['taskID', 'task_parent_object', 'target_price', 'real_price', 'unitID'],
    components: {
        UnitModal,
        Operating,
        ToolTipComponent,
        ConfirmDialogComponent,
    },
    data() {
        return {
            editTarget: false,
            editReal: false,
            changedTargetPrice: null,
            changedRealPrice: 0,
            unit: [{value: "元"}, {value: "个"}],
            unit_id: 1,
            task_operators: false,
            task: "task",
        }
    },
    created() {
        this.changedRealPrice = 0;
    },
    computed: {
        targetPrice: {
            get: function() {
                if(!!this.changedTargetPrice) {
                    return this.changedTargetPrice;
                } else if(!!this.target_price) {
                    return this.target_price;
                }
            },
            set: function(newValue) {
                this.changedTargetPrice = newValue;
            }
        },
        realPrice: {
            get: function() {
                if(!!this.changedRealPrice) {
                    return this.changedRealPrice;
                } else if(!!this.real_price) {
                    return this.real_price;
                } else {
                    return 0;
                }
            },
            set: function(newValue) {
                this.changedRealPrice = newValue;
            }
        },
        taskUnit() {
            if(!!this.unit_id) {
                return this.unit_id;
            } else if(!!this.unitID) {
                return this.unitID;
            } 
        },
    },
    methods: {
        ...mapActions('task', ['updateTaskOne']),
        editTargetPrice() {
            this.editTarget = true;
        },
        editRealPrice() {
            this.editReal = true;
        },
        submitChangedTargetPrice() {
            this.editTarget = false;
            if(!!this.changedTargetPrice) {
                this.$emit("editTargetPrice", this.changedTargetPrice);
            }
        },
        submitChangedRealPrice() {
            this.editReal = false;
            if(!!this.changedRealPrice)
            {
                this.$emit("editRealPrice", this.changedRealPrice);
            }
        },
        displayUnitModal() {
            this.$refs.unit.open();
        },
        handle_unitSubmit(prop) {
            this.unit_id = prop;
            this.$emit("editTaskUnit", this.unit_id);
        },
        showTaskOperators() {
            this.task_operators = !this.task_operators;
        },
        confirmClick(prop) {
            if(prop == true) {
                this.updateTaskOne({
                    'task_id' : this.taskID,
                    'task_parent_object' : this.task_parent_object,
                    'task_target_price' : 0
                });
                this.changedRealPrice = 0;
            }
        }
    }
}
</script>

<style>
.quantifyEdit {
    background: #fafbfc !important;
    border-radius: 6px;
}
.height_100 {
    height: 100%;
}
.height_24 {
    height: 24px;
}
.d_flex_quantify {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
}
.m_20_0 {
    margin: 20px 0px 0px 0px;
}
.mt_10 {
    margin-top: 10px;
}
.mr_5 {
    margin-right: 5px;
}
.p_5 {
    padding: 5px;
}
.p_5_10 {
    padding: 5px 10px;
}
.ptb_5 {
    padding: 5px 0px;
}
.pt_10 {
    padding-top: 10px;
}
.font_family {
    font-family: "Helvetica Neue",Helvetica,arial,"Hiragino Sans GB",\5b8b\4f53,sans-serif;
}
.horizontal_divider {
    border: 1px dashed #d9e2e4;
}
.quantify_title {
    font-size: 18px;
    color: #83898f;
    margin-right: 15px;
}
.quantify_value {
    font-size: 18px;
    color: #55c5c6;
    margin-right: 15px;
}
.quanity_edit_pencil {
    font-size: 12px !important;
    padding: 2px;
    border-radius: 4px;
    opacity: 0;
    transition: all ease .5s;
}
.editTarget:hover .quanity_edit_pencil {
    background: rgb(213 233 234);
    opacity: 1;
}
.edit_target_price {
    width: 70px;
    margin-right: 10px !important;
    margin: 0px;
    padding: 0px;
}
.unit {
    padding: 0 4px;
    cursor: pointer;
}
.unit_value {
    color: #bfc3c7;
    font-size: 14px !important;
}
.down_icon {
    color: #bfc3c7 !important;
    font-size: 18px !important;
}
.quantifyCollapse {
    cursor: pointer;
}
.collapse_title {
    font-size:14px;
    color:#83898f;
    margin:0px;
}
.collapse_icon {
    transition: all ease .7s;
    font-size:16px !important;
    color:#83898f !important;
}
.collapse_icon_rotate {
    transform: rotate(180deg);
}
.quantifyCollapse:hover .collapse_title {
    color: #318ce7;
}
.quantifyCollapse:hover .collapse_icon {
    color: #318ce7 !important;
}
</style>