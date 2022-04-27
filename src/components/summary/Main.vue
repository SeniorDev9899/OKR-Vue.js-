<template>
    <div class="summary-container d-flex align-start justify-start">
        <Sidebar @selectDivision="handle_selectDivision" />
        <div style="width: 100%;" class="px-6 py-4">
            <Header />
            <Content :year="year" :month="month" />
        </div>
    </div>
</template>

<script>
import Header from '@/components/summary/Header.vue';
import Content from '@/components/summary/Content.vue';
import Sidebar from '@/components/summary/Sidebar.vue';

export default {
    name:'SummaryMain',
    data() {
        return {
            year: null,
            month: null,
        }
    },
    created() {
        let date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
    },
    components: {
        Header,
        Content,
        Sidebar
    },
    methods: {
        handle_selectDivision(param) {
            this.year = param.year;
            this.month = param.month;
        }
    }
}
</script>

<style scoped>
.summary-container {
    width: 100%;
    font-size: 14px;
}
</style>