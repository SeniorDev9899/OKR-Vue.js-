<template>
<v-sheet class="width100">
  <v-container d-flex align-center justify-center>
    <GoalProgress :objectId="objectID" />
    <!-- :goalProgress="progressList" @toggleProgressList = "handle_toggleProgressList" -->
  </v-container>
  <v-container d-flex align-center justify-center>
    <ScheduleDivider />
  </v-container>
  <v-container>
    <v-flex class="width100 pl_5"><span class="krProgress">KR的进展</span></v-flex>
    <KRProgress @select="selectKr(keyresult)" v-for="(keyresult, index) in currentOkrKeyresults" :key="keyresult.kr_id" :length="currentOkrKeyresults.length" :keyresult="keyresult" :count="index + 1" />
  </v-container>
  <PercentDialogComponent ref="percent" :percent="completion" :isAuto="0" v-on:savePercentValue="(param) => getPercentValue(param)" />
  <RightEditor ref="rightKrEditor" />
</v-sheet>
</template>

<script>
import GoalProgress from '@/components/okrgoal/okrDetail/Progress/components/GoalProgress.vue';
import ScheduleDivider from '@/components/okrgoal/okrDetail/Progress/components/ScheduleDivider.vue';
import KRProgress from '@/components/okrgoal/okrDetail/Progress/components/KRProgress.vue';
import PercentDialogComponent from '@/components/okrgoal/shared/PercentDialogComponent.vue';
import {
  mapGetters,
  mapActions
} from 'vuex';

export default {
  name: 'ProgressComponent',
  props: ['object_id'],
  data() {
    return {
      completion: 0,
      objectID: null,
      //  progressList: [],
    }
  },
  created() {
    // this.getProgress({
    //     "pr_parent": this.object_id,
    //     "pr_parent_type": 0,
    // });
    // setTimeout(() => {
    //     this.progressList = this.objectProgress.slice(0, 1);
    //     if(this.objectProgress.length > 2)
    //     {
    //         const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
    //         this.progressList[0].changedValue = changedValue;
    //     }
    // }, 50);
    if (!!this.object_id) {
      this.objectID = this.object_id;
    }
  },
  components: {
    PercentDialogComponent,
    ScheduleDivider,
    GoalProgress,
    KRProgress,
    RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue'),
  },
  computed: {
    ...mapGetters('okr', ['okrObj']),
    ...mapGetters('progress', ['objectProgress']),
    currentOkrKeyresults: function () {
      const index = this.okrObj.findIndex(item => item.ob_id == this.objectID);
      return this.okrObj[index].ob_results;
    },
  },
  watch: {
    object_id(v) {
      this.objectID = v;
    }
  },
  methods: {
    ...mapActions('progress', ['getProgress', 'addProgress']),
    getPercentValue(param) {
      let info = {
        pr_creator: 1,
        pr_parent: this.objectID,
        pr_parent_type: 0,
        pr_percent: param.pr_percent,
        pr_status: param.pr_status,
        pr_description: param.pr_description,
      }
      this.addProgress(info);
    },
    selectKr(kr) {
      this.$refs.rightKrEditor.open({
        obId: this.object_id,
        krObj: kr
      })
    }
    // handle_toggleProgressList(prop) {
    //     if(prop.showMore == true)
    //     {
    //         this.progressList = this.objectProgress;
    //         if(this.objectProgress.length > 2)
    //         {
    //             const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
    //             this.progressList[0].changedValue = changedValue;
    //         }
    //     } else if(prop.showMore == false)
    //     {
    //         this.progressList = this.objectProgress.slice(0, 1);
    //         if(this.objectProgress.length > 2)
    //         {
    //             const changedValue = this.objectProgress[0].pr_percent - this.objectProgress[1].pr_percent;
    //             this.progressList[0].changedValue = changedValue;
    //         }
    //     }
    // }
  }
}
</script>

<style scoped>
.width100 {
  width: 100%;
}

.krProgress {
  font-size: 14px;
  font-family: -apple-system, Arial, Verdana, Helvetica Neue, Helvetica, sans-serif;
  font-weight: 600;
  color: #141c28;
  line-height: 22px;
  margin-bottom: 6px;
  margin-left: 8px
}

.pl_5 {
  padding-left: 5px;
}
</style>
