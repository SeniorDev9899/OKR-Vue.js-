<template>
    <v-navigation-drawer absolute right temporary width="720" v-model="summaryShow" overlay-color="white" overlay-opacity="0" color="white">
        <Header @closeRightSummaryEdit="handle_closeRightSummaryEdit" />
        <v-divider></v-divider>
        <Title :info="reportInfo" />
        <Content :info="reportInfo" :type="summaryType" />
        <v-divider class="mt_25"></v-divider>
        <Bottom />
        <Operating :info="reportInfo" :type="summaryType" />
        <Intercom :info="reportInfo" :type="summaryType" />
    </v-navigation-drawer>
</template>

<script>
import Header from '@/components/summary/rightSummaryEdit/header/Header.vue';
import Title from '@/components/summary/rightSummaryEdit/title/Title.vue';
import Content from '@/components/summary/rightSummaryEdit/content/Content.vue';
import Bottom from '@/components/summary/rightSummaryEdit/bottom/Bottom.vue';
import Operating from '@/components/summary/rightSummaryEdit/bottom/Operating.vue';
import Intercom from '@/components/summary/rightSummaryEdit/bottom/Intercom.vue';

export default {
    data() {
        return {
            summaryShow: false,
            summaryType: null,
            reportInfo: null,
        }
    },
    components: {
        Header,
        Title,
        Content,
        Bottom,
        Operating,
        Intercom,
    },
    methods: {
        displayRightSummary(prop) {
            this.reportInfo = prop.value;
            this.summaryType = prop.type;
            this.summaryShow = true;
        },
        handle_closeRightSummaryEdit() {
            this.summaryShow = false;
        }
    }
}
</script>

<style>
.mt_25 {
    margin-top: 25px;
}
</style>