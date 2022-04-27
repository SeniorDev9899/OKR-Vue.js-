<template>
    <div class="d-flex justify-center align-center pb-2">
        <v-spacer></v-spacer>
        <div class="user-name d-flex justify-start align-center ml-15">
            <UserAvatar :name="selectedObj ? selectedObj.ob_owners.employeeName.substring(0, 1).toUpperCase() : ''" width='30px' height = '30px' />
            <ToolTipComponent :tooltipText="selectedObj ? selectedObj.ob_name : ''" direction="bottom">
                <span class="ml-2">{{selectedObj ? selectedObj.ob_name : ''}}</span>
            </ToolTipComponent>
        </div>
        <v-spacer></v-spacer>
        <div class="select-object mr-4" @click="openUserSelect">
            <span>切换目标</span>
        </div>
        <AddSort ref="addsort" :okrObj="okrObjList" v-on:setPersonalGoal="param => setObject(param)" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddSort from '@/components/common/AddSort.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import { constant } from '@/constants/constant.js';
import ToolTipComponent from '@/components/okrgoal/shared/ToolTipComponent.vue';

export default {
    name: 'Header',
    props: ['selectedObj'],
    components: {
        AddSort,
        UserAvatar,
        ToolTipComponent
    },
    mounted() {
        
    },
    computed: {
        ...mapGetters("okr", ["okrObj", "okrDetail"]),
        okrObjList: function() {
            let okrObjList = [];
            this.okrObj.map(obj => {
                let obc = obj.ob_cycle;
                let year = obj.ob_start_date + '-' + obj.ob_end_date;
                let cycle = '';
                let goal = '全部状态';
                let quater = '';
                if(obc.includes('/')) {
                    quater = '/' + obc.split('/')[1];
                }
                if(obc.includes('-')) {
                    quater = '-' + obc.split('-')[1];
                }
                constant.cycleItems.map(c => {
                    if(c.dbformat == quater) {
                        cycle = c.title;
                    }
                });
                constant.statusItems.map(s => {
                    if(s.dbformat == obj.ob_status) {
                        goal = s.title;
                    }
                });
                let tmp = {
                    id: obj.ob_id,
                    cycle: cycle,
                    content: obj.ob_name,
                    year: year,
                    goal: goal,
                    parent: false
                }
                okrObjList.push(tmp);
            });
            return okrObjList;
        },

    },
    methods: {
        ...mapActions("okr", ["getOkrs", "getDetail"]),
        openUserSelect() {
            this.$refs.addsort.openDialog();
        },
        setObject(obj) {
            this.getDetail(obj.ob_id);
            this.$emit('pickObject', obj.ob_id)
        },
    }
}
</script>

<style scoped>
.select-object {
    width: 88px;
    background: rgba(255, 255, 255, 0.2);
    height: 21px;
    line-height: 21px;
    border-radius: 10px;
    color: rgb(255, 255, 255);
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
}

.user-name {
    font-size: 18px;
    color: rgb(255, 255, 255);
    line-height: 24px;
    margin-left: 10px;
    white-space: nowrap;
    /* max-width: calc(100% - 300px); */
    /* width: 100%; */
    /* overflow: hidden;
    cursor: default;
    text-overflow: ellipsis; */
}
</style>