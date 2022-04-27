<template>
    <div class="content-container">
        <div class="more-option d-flex justify-end align-center">
            <!-- <div class="option-item">
                <span class="mr-1"><v-icon style="font-size: 18px;">mdi-view-grid-outline</v-icon></span>
                <span>任务中心</span>
            </div>
            <div class="option-item ml-2">
                <span class="mr-1"><v-icon style="font-size: 18px;">mdi-poll</v-icon></span>
                <span>任务统计</span>
            </div>
            <div class="option-item-rect ml-2">
                <v-btn class="ma-2" outlined><v-icon style="font-size: 18px;">mdi-clipboard-text-outline</v-icon>上级规定</v-btn>
            </div>
            <div class="option-item-rect ml-2">
                <v-btn class="ma-2" outlined><v-icon style="font-size: 18px;">mdi-gesture-double-tap</v-icon>管理下属</v-btn>
            </div>
            <div class="option-item-rect ml-2">
                <v-btn class="ma-2" outlined><v-icon style="font-size: 18px;">mdi-message-text-outline</v-icon>提醒上级查看</v-btn>
            </div> -->
        </div>
        <div class="tab-container">
            <v-tabs v-model="tab" icons-and-text height="36">
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#tab-1">
                    <span>
                        <v-icon style="font-size: 18px;">mdi-account-outline</v-icon>
                        <span>我的计划表</span>
                    </span>
                </v-tab>
                <!-- <v-tab href="#tab-2">
                    <span>
                        <v-icon style="font-size: 18px;">mdi-account-supervisor-outline</v-icon>
                        <span>下属计划表</span>
                    </span>
                </v-tab> -->
            </v-tabs>
            <v-tabs-items v-model="tab" class="">
                <v-tab-item id="tab-1">
                    <TabFirstComponent :selectedCycle="selectedCycle" :selectedYear="selectedYear" ref="tabFirst" @openEdit="openEdit" />
                </v-tab-item>
                <!-- <v-tab-item id="tab-2">
                    
                </v-tab-item> -->
            </v-tabs-items>
        </div>
        <TaskEdit ref="taskEditor" />
    </div>
</template>

<script>
import TabFirstComponent from '@/components/schedule/TabFirstComponent.vue';
import TaskEdit from '@/components/common/taskEdit/TaskEdit.vue';

export default {
    name: 'ContentComponent',
    components: {
        TabFirstComponent,
        TaskEdit
    },
    data() {
        return {
            tab: null,
            selectedCycle: -2,
            selectedYear: ''
        }
    },
    methods: {
        handleCycle(param) {
            this.selectedCycle = param;
        },
        setYear(param) {
            this.selectedYear = param;
        },
        openEdit(task) {
            this.$refs.taskEditor.openTaskEditor(task);
        }
    }
}
</script>

<style scoped>
.content-container {
    padding: 20px;
    width: 100%;
    font-size: 14px;
}

.option-item:hover {
    cursor: pointer;
}

.option-item-rect:hover {
    cursor: pointer;
}

.v-tab {
    font-size: 18px !important;
}

.v-tabs {
    border-bottom: 1px solid #e4ebf0;
}

.more-option {
    position: relative;
    z-index: 10;
}

.tab-container {
    position: relative;
    /* z-index: 5; */
}
</style>