<template>
<div class="top-right px-4 py-3">
  <div class="header d-flex justify-start align-center mb-2">
    <span class="left">OKR</span>
    <span class="right"><a>
        <v-icon class="mr-1" style="font-size: 18px;">mdi-help-circle</v-icon>了解目标管理
      </a></span>
  </div>
  <div class="okr-item-header pl-3 pr-4 d-flex justify-space-between align-center">
    <span class="object-icon">目标</span>
    <span class="object-name" @click="openObjDetailTab">{{selectedObj ? selectedObj.ob_name : ''}}</span>
    <v-spacer></v-spacer>
    <span>
      <v-progress-circular :size="60" :width="5" :value="selectedObj ? selectedObj.ob_progress : ''" color="rgb(40, 121, 255)">
        {{selectedObj ? selectedObj.ob_progress : ''}}%
      </v-progress-circular>
    </span>
    <span class="ml-6">--</span>
  </div>
  <div class="kr-item pl-3 pr-4 d-flex justify-space-between align-center" v-for="kr in selectedObj ? selectedObj.ob_results : []" :key="kr.kr_id">
    <span class="kr-order">KR{{kr.kr_order}}</span>
    <span style="font-size: 12px;" class="kr-name" @click="openKRDetailTab(kr)">{{kr.kr_name}}</span>
    <v-spacer></v-spacer>
    <span style="font-size: 12px;color: rgb(255, 169, 17);" class=" kr-confidence mr-2 ">
      <v-icon style="font-size: 18px;color: rgb(255, 169, 17);">mdi-heart-outline</v-icon>{{kr.kr_confidence}}/10
    </span>
    <span class="complete-progress">完成度{{kr.kr_completion}}%</span>
    <span class="ml-6 kr-other">--</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'Object',
  components: {},
  props: ['selectedObj'],
  data() {
    return {}
  },
  methods: {
    openObjDetailTab: function () {
      this.$emit('openObjDetailTab')
    },
    openKRDetailTab: function (data) {
      this.$emit('openKRDetailTab', data)
    }
  }
}
</script>

<style scoped>
.top-right {
  width: 50%;
  border-left: 2.5px solid rgb(0 0 0 / 5%);
  border-bottom: 2.5px solid rgb(0 0 0 / 5%);
  overflow-y: auto;
  height: 50%;
}

.okr-item-header {
  background: #fafbfc;
  height: 80px;
  margin-bottom: 8px;
  line-height: 80px;
  padding-bottom: 10px;
  position: relative;
}

.object-icon {
  width: 36px;
  height: 20px;
  background: #50e3c2;
  border-radius: 22px;
  color: #fff;
  margin-right: 8px;
  font-size: 12px;
  display: inline-block;
  line-height: 20px;
  text-align: center;
}

.kr-item {
  background: #fafbfc;
  height: 40px;
  margin-bottom: 8px;
  line-height: 40px;
  /* padding-bottom: 10px; */
}

.complete-progress {
  font-size: 12px;
  color: rgb(131, 137, 143);
  line-height: 20px;
  white-space: nowrap;
  width: 70px;
  margin-left: 10px;
}

.kr-order {
  background: rgba(46, 156, 255, 0.1);
  border-radius: 11.5px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: rgb(46, 156, 255);
  margin-right: 10px;
  padding: 3px 9px;
}

.object-name:hover {
  cursor: pointer;
}

.kr-name:hover {
  cursor: pointer;
}

.kr-other {
  white-space: nowrap;
}

.kr-confidence {
  white-space: nowrap;
}

.kr-name {
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
