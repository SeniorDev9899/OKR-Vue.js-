<template>
<v-flex class = "w100">
    <v-sheet>
        <v-container align-center justify-start d-flex>
            <v-layout align-center justify-start column>
                <Operating :task_id = "task_id" />
                <Intercom :task_id = "task_id" />
            </v-layout>
        </v-container>
    </v-sheet>
</v-flex>
</template>

<script>
import Operating from '@/components/common/taskEdit/taskBottomEdit/interactive/operating/Operating.vue';
import Intercom from '@/components/common/taskEdit/taskBottomEdit/interactive/intercom/Intercom.vue';

export default {
    props: ['task_id'],
    data() {
        return {
        }
    },
    components: {
        Operating,
        Intercom,
    },
}
</script>

<style>
</style>