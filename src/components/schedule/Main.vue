<template>
    <div class="schedule-container d-flex justify-start align-start">
        <Sidebar @selectDivision="selectDivision" @selectYear="selectYear" />
        <Content ref="content" />
    </div>
</template>

<script>
import Sidebar from '@/components/schedule/Sidebar.vue';
import Content from '@/components/schedule/Content.vue';

export default {
    name: 'ScheduleMain',
    components: {
        Sidebar,
        Content
    },
    props: [],
    methods: {
        selectDivision: function(param) {
            this.$refs.content.handleCycle(param);
        },
        selectYear: function(param) {
            this.$refs.content.setYear(param);
        }
    }   
}
</script>

<style scoped>
    .schedule-container {
        height: 100%;
    }
</style>