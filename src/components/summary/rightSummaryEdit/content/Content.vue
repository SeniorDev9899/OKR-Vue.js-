<template>
    <v-container d-flex class="width100 summary-content">
        <v-layout align-center justify-center column class="width100 m_0">
            <v-flex d-flex class="width100">
                <v-layout align-center justify-center class="width100 m_0 mb_25">
                    <v-flex class="width100">
                        <v-layout d-flex align-center justify-start row class="width100 m_0">
                            <v-flex d-flex align-center justify-start shrink><span class="content-task-sheet">进行中任务<span style="font-size:18px;margin-left:5px;margin-right:5px;">{{ summaryTaskProgress }}</span><v-icon size="18">mdi-help-circle</v-icon></span></v-flex>
                            <v-flex d-flex align-center justify-start shrink><span class="content-task-sheet">过期任务<span style="font-size:18px;margin-left:5px;margin-right:5px;">{{ summaryTaskOverdue }}</span></span></v-flex>
                            <v-flex d-flex align-center justify-start shrink><span class="content-task-sheet">完成任务<span style="font-size:18px;margin-left:5px;margin-right:5px;">{{ summaryTaskMission }}</span></span></v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex class="width100 summary-obstacle">
                <v-layout align-center justify-center column class="width100 m_0 mt_20">
                    <v-flex d-flex align-center justify-start class="width100"><span class="summary-obstacle-title">总结与障碍</span></v-flex>
                    <v-flex d-flex align-center justify-start class="width100"><span class="summary-obstacle-content">{{ summaryObstacleContent }}</span></v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex class="width100 next-work">
                <v-layout align-center justify-center column class="width100 m_0 mt_20">
                    <v-flex d-flex align-center justify-start class="width100"><span class="next-work-title">下一步工作安排</span></v-flex>
                    <v-flex d-flex align-center justify-start class="width100"><span class="next-work-content">{{ nextWorkArrangement }}</span></v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex class="width100 visible-range">
                <v-layout align-center justify-start row class="width100 m_0 mt_20 visible-range-members">
                    <v-flex shrink class="mr-4">
                        <span class="ta_view">@ ta查看</span>
                        <v-menu max-width="300" :close-on-content-click="true" offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on" class="add_new_member">添加</span>
                            </template> 
                            <v-sheet>
                                <UserPicker @pick="addNewMember" />
                            </v-sheet>
                        </v-menu>
                    </v-flex>
                    <v-divider vertical class="mr-4"></v-divider>
                    <v-flex shrink v-if="summaryContacts.length != 0" v-for="(contact, index) in summaryContacts" :key="contact" class="mr-3 summary_contact_item">
                        <v-avatar size="35" color="#f5b168">
                            {{ contact | surename }}
                        </v-avatar>
                        <span class="summary_contact_remove" @click="removeContactItem(index)"><v-icon size="14" class="close">mdi-close-circle</v-icon></span>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import UserPicker from '@/components/common/UserPicker.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['info', 'type'],
    data() {
        return {
            summaryTaskProgress: 0,
            summaryTaskOverdue: 0,
            summaryTaskMission: 0,
            summaryContacts: [],
        }
    },
    created() {
        this.getUsers();
    },
    watch: {
        info: function(newValue, oldValue) {
            if(newValue.rp_ta_contacts != "") {
                this.summaryContacts = newValue.rp_ta_contacts.split(",");
            }
        }
    },
    components: {
        UserPicker,
    },
    computed: {
        ...mapGetters('report', ['report']),
        summaryObstacleContent() {
            if(!!this.info) {
                return this.info.rp_abstract.replace(/<[^>]+>/g, '');
            }
        },
        nextWorkArrangement() {
            if(!!this.info) {
                return this.info.rp_todo.replace(/<[^>]+>/g, '');
            }
        },
    },
    methods: {
        ...mapActions('report', ['updateDailyReport', 'updateWeeklyReport', 'updateMonthlyReport']),
        ...mapActions('user', ['getUsers']),
        addNewMember(e) {
            this.summaryContacts.push(e.user.id);
            if(!!this.type)
            {
                if(this.type == "daily")
                {
                    this.updateDailyReport({
                        "rp_id" : this.info.rp_id,
                        "rp_ta_contacts" : this.summaryContacts.toString(),
                    });
                } else if(this.type == "weekly") {
                    this.updateWeeklyReport({
                        "rp_id" : this.info.rp_id,
                        "rp_ta_contacts" : this.summaryContacts.toString(),
                    });
                } else {
                    this.updateMonthlyReport({
                        "rp_id" : this.info.rp_id,
                        "rp_ta_contacts" : this.summaryContacts.toString(),
                    });
                }
            }
        },
        removeContactItem(i) {
            this.summaryContacts.splice(i, 1);
            if(!!this.type)
            {
                if(this.type == "daily")
                {
                    this.updateDailyReport({
                        "rp_id" : this.info.rp_id,
                        "rp_ta_contacts" : this.summaryContacts.toString(),
                    });
                } else if(this.type == "weekly") {
                    this.updateWeeklyReport({
                        "rp_id" : this.info.rp_id,
                        "rp_ta_contacts" : this.summaryContacts.toString(),
                    });
                } else {
                    this.updateMonthlyReport({
                        "rp_id" : this.info.rp_id,
                        "rp_ta_contacts" : this.summaryContacts.toString(),
                    });
                }
            }
        }
    }
}
</script>

<style>
.mb_25 {
    margin-bottom: 25px;
}
.mt_20 {
    margin-top: 20px !important;
}
.summary-content {
    padding-top: 25px;
}
.content-task-sheet {
    display: flex;
    align-items: center;
    margin-right: 25px;
    color: #35434C;
    font-size: 17px;
}
.summary-obstacle-title {
    color: #36434D;
    font-size: 16px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
    padding: 0 5px;
    border-bottom: 2px solid #e4ebf0;
    width: 100%;
}
.next-work-title {
    color: #36434D;
    font-size: 16px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",STHeitiSC,sans-serif;
    padding: 0 5px;
    border-bottom: 2px solid #e4ebf0;
    width: 100%;
}
.summary-obstacle-content {
    padding: 5px 10px;
    color: #35434C;
    width: 760px;
    overflow-x: auto;
    font-size: 15px;
}
.next-work-content {
    padding: 5px 10px;
    color: #35434C;
    width: 760px;
    overflow-x: auto;
    font-size: 15px;
}
.visible-range-members {
    background-color: #F5F8FA;
    padding: 10px;
}
.ta_view {
    color: #647481;
    font-size: 14px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB",SimSun,STHeitiSC,sans-serif;
    margin-right: 5px;
}
.add_new_member {
    color: #00599B;
    cursor: pointer;
    font-size: 12px;
    font-family: "Helvetica Neue",Tahoma,"PingFang SC","Hiragino Sans GB",SimSun,STHeitiSC,sans-serif;
}
.summary_contact_item {
    position: relative;
}
.summary_contact_remove {
    position: absolute;
    right: -7px;
    bottom: 20px;
    cursor: pointer;
    opacity: 0;
    transition: all ease .5s;
}
.summary_contact_item:hover .summary_contact_remove {
    opacity: 1;
}
.summary_contact_remove:hover .close {
    color: #e63d3d !important
}
</style>