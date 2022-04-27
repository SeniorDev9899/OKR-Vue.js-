<template>
    <v-sheet class="width100 m_0">
        <v-layout align-center justify-start row class="width100 wt_list wt_mt_30">
            <v-flex grow>
                <v-text-field v-if="editWorkingTime" hide-details v-model="workingTimeName" class="edit_working_time_name" @keyup.enter="updateWorkingTimeName"></v-text-field>
                <span v-else class="wt_name" @click="editWorkingTimeName">{{ content.wt_name }}</span>
            </v-flex>
            <v-flex shrink>
                <span class="single_hour">{{ content.wt_hours }}</span>
                <span class="single_date">{{ content.wt_date.split("-")[1] + "/" + content.wt_date.split("-")[2] }}</span>
                <span v-if = "wtID === content.wt_id" class="wt_down" @click="singleWTEdit(0)">收起</span>
                <span v-else class="wt_down" @click="singleWTEdit(content.wt_id)">详情</span>
                <v-icon  class="toggle_icon" :class="wtID === content.wt_id ? 'toggle_icon_sec' : ''">mdi-chevron-down</v-icon>
            </v-flex>
            <ConfirmDialogComponent
                v-on:click="(bool) => confirmClick(bool)"
                :option="workingHour"
            >
                <v-flex shrink class="workinghour_delete"><v-icon class="delete">mdi-delete-circle</v-icon></v-flex>
            </ConfirmDialogComponent>
        </v-layout>
        <WorkingHourItemDetail v-if="wtID === content.wt_id" :content="content" @updateWorkingHour="handle_updateWorkingHour" />
    </v-sheet>
</template>

<script>
import ConfirmDialogComponent from '@/components/okrgoal/shared/ConfirmDialogComponent.vue';
import WorkingHourItemDetail from './WorkingHourItemDetail.vue';

export default {
    props: ['content'],
    data() {
        return {
            wtID: 0,
            workingHour: "workinghour",
            workingHourDetail: false,
            editWorkingTime: false,
            workingTimeName: null,
        }
    },
    created() {
    },
    components: {
        ConfirmDialogComponent,
        WorkingHourItemDetail,
    },
    methods: {
        singleWTEdit(id) {
            this.wtID = id;
        },
        confirmClick(prop) {
            if(prop == true) {
                this.$emit("deleteWorkingTime", this.content.wt_id);
            }
        },
        handle_updateWorkingHour(prop) {
            this.$emit("updateWorkingHour", prop);
        },
        editWorkingTimeName() {
            this.editWorkingTime = true;
            this.workingTimeName = this.content.wt_name;
        },
        updateWorkingTimeName() {
            this.editWorkingTime = false;
            this.$emit("updateWorkingHour", {"wt_id":this.content.wt_id,"wt_name":this.workingTimeName});
        }
    }
}
</script>

<style>
.wt_list:hover .workinghour_delete {
    opacity: 1;
}
.workinghour_delete {
    transition: all ease .7s;
    opacity: 0;
    margin-left: 10px;
}
.workinghour_delete .delete {
    font-size: 16px;
    cursor: pointer;
}
.edit_working_time_name {
    padding: 0px !important;
    margin: 0px !important;
}
</style>