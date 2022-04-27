<template>
    <v-sheet class = "kr_container">
        <v-list class="key-result-item-list py-0" style="position: relative;">
            <div v-for="(kr, i) in keyresults" :key="kr.kr_id">
                <AdvancedKeyResultItemComponent :keyResult="kr" :obId="object_id" :obStatus="obStatus" :disableEdit="disableEdit" @selectKR="selectKR" @delete="deleteKeyResult"/>
            </div>
            <div class="overlay" @click="ev => ev.stopPropagation()"></div>
        </v-list>
        <RightEditor ref="rightEditor" />
    </v-sheet>
</template>

<script>
import AdvancedKeyResultItemComponent from '@/components/okrgoal/shared/AdvancedKeyResultItemComponent.vue';

export default {
    name: 'KeyResultListComponent',
    components: {
        AdvancedKeyResultItemComponent,
        RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue'),
    },
    props: ['object_id', 'okrObj', 'disableEdit'],
    data() {
        return {
            deleteObj: null
        }
    },
    computed: {
        keyresults: function() {
            if(this.okrObj.length !== 0) {
                const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
                if(this.deleteObj != null) {
                    const index = selectedObj[0].ob_results.findIndex(kr => kr.kr_id == this.deleteObj.kr_id);
                    selectedObj[0].ob_results.splice(index, 1);
                }
                return selectedObj[0].ob_results;
            }else{
                return [];
            }
        },
        obStatus: function() {
            if(this.okrObj.length !== 0) {
                const selectedObj = this.okrObj.filter(obj => obj.ob_id == this.object_id);
                return selectedObj[0].ob_status;
            }
        }
    },
    methods: {
        selectKR(data) {
            this.$refs.rightEditor.open(data);
        },
        deleteKeyResult(data) {
            this.deleteObj = data;
            // let tmp = [];
            // this.okrObj.map(obj => {
            //     if(obj.ob_id == this.object_id) {
            //         const index = obj.ob_results.findIndex(kr => kr.kr_id == data.kr_id);
            //         obj.ob_results.splice(index, 1);
            //     }
            //     tmp.push(obj);
            // });
            // this.okrObj = tmp;
        }
    }
}
</script>