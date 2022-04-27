<template>
<div class="bottom-right  py-3 px-4">
  <div class="header d-flex justify-space-between mb-2">
    <span class="left">当前进展</span>    
  </div>
  <div class="progress-container mb-4 py-6 px-3" v-for="p in progressList" :key="p.pr_id">
    <div class="d-flex justify-space-between align-center">
      <span style="color: #83ba5a" class="mr-2">{{p.date}}</span>
      <span class="progress-circle mr-2">
        <span class="progress-circle-inner"></span>
      </span>
      <span style="color: #83898f;">O：{{p.ob_name}}</span>
      <v-spacer></v-spacer>
      <span>{{p.employeeName}}</span>
    </div>
    <div class="ml-12 mt-1">
      <span style="color: #83ba5a;">进展:</span>
      <span style="color: #36434D;" v-html="p.pr_description">
      </span>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';

export default {
  name: 'Progress',
  components: {},
  props: [],
  data() {
    return {}
  },
  computed: {
    ...mapGetters('progress', ['objectProgress']),
    progressList: function () {
      this.objectProgress.map(p => {
        let date = new Date(p.created_at);
        p.date = (date.getMonth() + 1) + '/' + date.getDate();
      });
      return this.objectProgress;
    }
  }
}
</script>

<style scoped>
.bottom-right {
  width: 50%;
  border-left: 2.5px solid rgb(0 0 0 / 5%);
  border-top: 2.5px solid rgb(0 0 0 / 5%);
  overflow-y: auto;
  height: 50%;
}

.progress-container {
  background: #fafbfc;
  margin-bottom: 8px;
  font-size: 12px;
}

.progress-circle {
  width: 15px;
  height: 15px;
  background: #cef2f4;
  border-radius: 15px;
  margin: 0 3px;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
  z-index: 5;
}

.progress-circle-inner {
  width: 8px;
  height: 8px;
  background: #83ba5a !important;
  border-radius: 8px;
  display: inline-block;
}
</style>
