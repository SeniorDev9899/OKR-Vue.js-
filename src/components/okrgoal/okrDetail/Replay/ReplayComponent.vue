<template>
    <v-container align-center justify-start d-flex class="right_progress_info">
        <v-layout align-center justify-start column>
            <Review :object_id="object_id" @displayReviewModal = "handle_displayReviewModal" />
            <ReviewModal ref = "replay" />
        </v-layout>
    </v-container>
</template>

<script>
import ReviewModal from '@/components/okrgoal/rightInfo/review/ReviewModal.vue';
import Review from '@/components/okrgoal/rightInfo/review/Review.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'ReplayComponent',
    props: ['object_id'],
    components: {
        ReviewModal,
        Review,
    },
    data() {
        return {
            selectedObj: Object,
        }
    },
    created() {
    },
    computed: {
        ...mapGetters('okr', ['okrObj']),
        object_name: function() {
            if(this.okrObj.length !== 0) {
                const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
                this.selectedObj = selectedObj[0];
                return selectedObj[0].ob_name;
            }else{
                return {};
            }
        },
    },
    methods: {
        handle_displayReviewModal(prop) {
            let param = {
                type: prop.mode,
                ob_name: this.object_name,
                value: prop.value,
            }
            this.$refs.replay.open(param);
        }
    }
}
</script>

<style scoped>
.right_progress_info {
  background-color: white;
  margin-top: 20px;
}
</style>