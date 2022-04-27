<template>
<v-sheet class="width100">
  <v-flex class="width100 mt_10" d-flex align-center justify-start>
    <v-icon v-if="progressInfo.status == 0" class="status colorNormal">mdi-circle-slice-8</v-icon>
    <v-icon v-if="progressInfo.status == 1" class="status colorDelay">mdi-circle-slice-8</v-icon>
    <v-icon v-if="progressInfo.status == 2" class="status colorRisk">mdi-circle-slice-8</v-icon>
    <v-icon v-if="progressInfo.status == 3" class="status colorEnd">mdi-circle-slice-8</v-icon>
    <span class="keyresultNumber cursorPointer">KR{{count}}</span>
    <span @click="selectKr" class="keyresultTitle cursorPointer">{{ title }}</span>
    <span class="percentValue">{{percent}}%</span>
  </v-flex class="width100 mt_10">
  <v-flex class="width100" d-flex align-center justify-start>
    <v-layout v-if="descriptionExist" class="width100 m_0" d-flex align-start justify-start row style="height:70px;">
      <v-flex grow class="ml_9" style="height:100%;">
        <v-layout class="width100 m_0 edit description" d-flex align-start justify-start row style="height:100%;">
          <v-flex shrink d-flex align-start justify-center style="height:100%;opacity:0;">
            <v-icon class="quoteIcon_kr">mdi-format-quote-open</v-icon>
          </v-flex>
          <v-flex grow>
            <v-layout d-flex align-center justify-start column>
              <v-flex class="width100"><span class="desc">{{ progressInfo.progresDescription }}</span></v-flex>
              <v-flex class="width100">
                <v-layout class="width100 m_0" d-flex align-center justify-start row>
                  <v-flex grow class="pl_2">
                    <span class="createdTime">{{ parseInt(month) }}月{{ parseInt(day) }}日</span><span class="createdTime">{{ hr }}:{{ min }}</span>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex shrink d-flex align-start justify-center style="opacity:0;">
        <v-icon class="quoteIcon">mdi-format-quote-close</v-icon>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex class="pl_12"><span class="emptyDescription">{{ progressDescription }}</span></v-flex>
    </v-layout>
  </v-flex>
</v-sheet>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';

export default {
  props: ['kr_id', 'count', 'length', 'title', 'percent', 'month', 'day', 'hr', 'min'],
  data() {
    return {
      status: 0,
      progressDescription: "暂未更新",
      descriptionExist: false,
      progressInfo: Object,
    }
  },
  created() {
    this.getProgressForObject(this.kr_id).then((res) => {
      if (res == "success") {
        this.proObjectList.forEach((item) => {
          if (item.keyresult_id == this.kr_id) {
            if (item.progressList) {
              this.progressInfo = {
                id: this.kr_id,
                progresDescription: item.progressList[0].pr_description.replace(/<[^>]+>/g, ''),
                status: item.progressList[0].pr_status,
              }
              this.descriptionExist = true;
            }
          }
        });
      }
    })
    this.progressInfo.status = 3;
  },
  computed: {
    ...mapGetters('progress', ['proObjectList']),
  },
  methods: {
    ...mapActions('progress', ['getProObject']),
    async getProgressForObject(krId) {
      let param = {
        pr_parent: krId,
        pr_parent_type: 1
      }
      const res = await this.getProObject(param);
      return res;
    },
    selectKr() {
        this.$emit('select')
    }
  }
}
</script>

<style scoped>
.width100 {
  width: 100%;
}

.mt_10 {
  margin-top: 10px;
}

.mt_8 {
  margin-top: 8px;
}

.ml_6 {
  margin-left: 6px;
}

.ml_9 {
  margin-left: 9px;
}

.mr_10 {
  margin-right: 10px;
}

.percentValue {
  font-size: 16px;
  font-weight: 600;
  color: #3f4755;
  line-height: 24px
}

.desc {
  font-size: 14px;
  color: #3f4755;
  line-height: 22px;
}

.createdTime {
  font-size: 12px;
  color: #a4acb9;
  line-height: 18px;
  margin-top: 6px;
  margin-right: 12px;
}

.quoteIcon_kr {
  color: rgb(233 241 244);
  position: relative;
}

.quoteIcon {
  color: rgb(233 241 244);
  position: relative;
  top: 10px;
}

.edit {
  height: 25px;
  /* padding-top: 8px;
    padding-bottom: 10px;
    padding-left: 3px;
    padding-right: 8px; */
  border-radius: 5px;
}

.description:hover {
  background-color: rgb(247 249 250);
}

.editPencil {
  font-size: 12px;
  color: #a4acb9;
}

.editProgressDescription {
  font-size: 12px;
  color: #a4acb9;
  margin-left: 4px;
}

.hidden_edit {
  transition: all .5s ease;
  cursor: pointer;
  opacity: 0;
}

.hidden_edit:hover .editPencil {
  color: rgb(79 137 226) !important;
}

.hidden_edit:hover .editProgressDescription {
  color: rgb(79 137 226) !important;
}

.description:hover .hidden_edit {
  opacity: 1;
}

.fontFamily {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei;
}

.keyresultNumber {
  font-size: 12px;
  font-family: -apple-system, Arial, Verdana, Helvetica Neue, Helvetica, sans-serif;
  color: #2879ff;
  line-height: 18px;
  margin-right: 4px;
}

.keyresultTitle {
  font-size: 13px;
  font-family: -apple-system, Arial, Verdana, Helvetica Neue, Helvetica, sans-serif;
  color: #89919f;
  line-height: 20px;
  margin-left: 4px;
  margin-right: 12px;
}

.cursorPointer {
  cursor: pointer;
}

.pl_2 {
  padding-left: 2px;
}

.pl_12 {
  padding-left: 12px;
}

.emptyDescription {
  font-size: 12px;
  color: #a4acb9;
  line-height: 18px;
  margin-top: 6px;
  margin-right: 12px;
  padding-left: 20px;
}

.colorNormal {
  color: blue !important;
}

.colorDelay {
  color: yellow !important;
}

.colorRisk {
  color: red !important;
}

.colorEnd {
  color: rgb(100, 100, 100) !important;
}

.status {
  font-size: 12px !important;
  margin-right: 5px;
}
</style>
