<template>
<v-layout class="width100 pl_10 b_0" d-flex align-center justify-start column>
  <KRProgressItem @select="selectKr" :kr_id="keyresultId" :length="length" :count="count" :title="title" :percent="percent" :month="month" :day="day" :hr="hr" :min="min" />
</v-layout>
</template>

<script>
import KRProgressItem from '@/components/okrgoal/okrDetail/Progress/components/KRProgressItem.vue';

export default {
  props: ['keyresult', 'count', 'length'],
  components: {
    KRProgressItem,
  },
  data() {
    return {
      keyresultId: null,
      year: null,
      month: null,
      day: null,
      hr: null,
      min: null,
      title: "",
      percent: null,
    }
  },
  created() {
    this.keyresultId = this.keyresult.kr_id;
    this.title = this.keyresult.kr_name;
    this.percent = this.keyresult.kr_completion;
    const time = new Date(this.keyresult.created_at);
    this.year = time.getFullYear();
    this.month = time.getMonth() + 1;
    if (this.month < 10) {
      this.month = "0" + this.month.toString();
    }
    this.day = time.getDate();
    if (this.day < 10) {
      this.day = "0" + this.day.toString();
    }
    this.hr = time.getHours();
    if (this.hr < 10) {
      this.hr = "0" + this.hr.toString();
    }
    this.min = time.getMinutes();
    if (this.min < 10) {
      this.min = "0" + this.min.toString();
    }
  },
  watch: {
    keyresult(v) {
      this.keyresultId = v.kr_id;
      this.title = v.kr_name;
      this.percent = v.kr_completion;
      const time = new Date(v.created_at);
      this.year = time.getFullYear();
      this.month = time.getMonth() + 1;
      if (this.month < 10) {
        this.month = "0" + this.month.toString();
      }
      this.day = time.getDate();
      if (this.day < 10) {
        this.day = "0" + this.day.toString();
      }
      this.hr = time.getHours();
      if (this.hr < 10) {
        this.hr = "0" + this.hr.toString();
      }
      this.min = time.getMinutes();
      if (this.min < 10) {
        this.min = "0" + this.min.toString();
      }
    }
  },
  methods: {
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

.pl_10 {
  padding-left: 10px;
}

.b_0 {
  border: 0px;
}
</style>
