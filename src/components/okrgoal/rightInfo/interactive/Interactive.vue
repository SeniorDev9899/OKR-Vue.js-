<template>
<v-flex class = "w100">
    <v-sheet>
        <v-container align-center justify-start d-flex>
            <v-layout align-center justify-start column>
                <Operating :kr_id = "kr_id" />
                <Intercom :kr_id = "kr_id" />
            </v-layout>
        </v-container>
    </v-sheet>
</v-flex>
</template>

<script>
import Operating from './operating/Operating.vue';
import Intercom from './intercom/Intercom.vue';

export default {
    props: ['kr_id'],
    components: {
        Operating,
        Intercom,
    },
}
</script>

<style>
</style>