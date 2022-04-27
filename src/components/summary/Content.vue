<template>
    <div class="content-container">
        <v-tabs v-model="tab" icons-and-text height="36"> 
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">
                <span>
                    <span>我的总结</span>
                </span>
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="">
            <v-tab-item id="tab-1" class="pt-4">
                <div class="tab-1-content">
                    <v-tabs v-model="tab2" icons-and-text height="36">
                        <v-tabs-slider></v-tabs-slider>
                        <v-tab href="#tab-1">
                            <span>
                                <span>日报</span>
                            </span>
                        </v-tab>
                        <v-tab href="#tab-2">
                            <span>
                                <span>周报</span>
                            </span>
                        </v-tab>
                        <v-tab href="#tab-3">
                            <span>
                                <span>月报</span>
                            </span>
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab2" class="">
                        <v-tab-item id="tab-1" class="pt-4">
                            <TabFirstComponent :year="year" :month="month" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
                        </v-tab-item>
                        <v-tab-item id="tab-2" class="pt-4">
                            <TabSecondComponent :year="year" :month="month" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
                        </v-tab-item>
                        <v-tab-item id="tab-3" class="pt-4">
                            <TabThirdComponent :year="year" :month="month" @displayRightSummaryEdit="handle_displayRightSummaryEdit" />
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </v-tab-item>
        </v-tabs-items>
        <RightSummaryEdit ref="summaryEdit" />
    </div>
</template>

<script>
import TabFirstComponent from '@/components/summary/TabFirstComponent.vue';
import TabSecondComponent from '@/components/summary/TabSecondComponent.vue';
import TabThirdComponent from '@/components/summary/TabThirdComponent.vue';
import RightSummaryEdit from '@/components/summary/rightSummaryEdit/RightSummaryEdit.vue';

export default {
    name: 'Content',
    props: ['year', 'month'],
    components: {
        TabFirstComponent,
        TabSecondComponent,
        TabThirdComponent,
        RightSummaryEdit,
    },
    data() {
        return {
            tab: null,
            tab2: null
        }
    },
    methods: {
        handle_displayRightSummaryEdit(prop) {
            this.$refs.summaryEdit.displayRightSummary(prop);
        }
    }
}
</script>

<style scoped>
.v-tab {
    font-size: 18px !important;
}

.v-tabs {
    border-bottom: 1px solid #e4ebf0;
}

.rect {
    border: 1px dotted #ddd;
    text-align: center;
    padding: 30px 0px;
}

.line {
    border-top: 2px solid #E3ECF1;
}

.report {
    padding: 20px;
}

.w-100 {
    width: 100%;
}

.date-info {
    border-left: 4px solid #2d83cf;
    font-size: 16px;
    color: #2d83cf;
}

.left-line {
    border-left: 6px solid #e3ecf1;
    padding-left: 8px;
}

.time-fb {
    line-height: 16px;
    color: #ccc;
    font-size: 12px;
}

.action-tag {

}
</style>