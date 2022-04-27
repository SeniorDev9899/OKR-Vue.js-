<template>
<v-timeline-item small :color="color" class="operator_item">
  <span class="listTime">
    <span class="listTime_day">{{ month }}/{{ day }}</span>
    <span class="listTime_time">{{ hr }}/{{ min }}</span>
  </span>
  <v-card class="elevation-2" style="box-shadow:none !important;">
    <v-card-text class="card_text_pre">
      <span style = "margin-right: 5px; font-size: 15px; color: black;">{{ userName }}</span>
      <span>{{ progress_value }}</span>
    </v-card-text>
  </v-card>
</v-timeline-item>
</template>

<script>
export default {
    props: ['color', 'progress_value', 'timestamp', 'userName'],
    data() {
        return {
            year: null,
            month: null,
            day: null,
            hr: null,
            min: null,
        }
    },
    created() {
        const time = new Date(this.timestamp);
        this.year = time.getFullYear();
        this.month = time.getMonth() + 1;
        if(this.month < 10)
        {
            this.month = "0" + this.month.toString();
        }
        this.day = time.getDate();
        if(this.day < 10)
        {
            this.day = "0" + this.day.toString();
        }
        this.hr = time.getHours();
        if(this.hr < 10)
        {
            this.hr = "0" + this.hr.toString();
        }
        this.min = time.getMinutes();
        if(this.min < 10)
        {
            this.min = "0" + this.min.toString();
        }
    },
}
</script>

<style>
.operator_item .v-timeline-item__divider .v-timeline-item__dot {
  height: 15px !important;
  width: 15px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.operator_item .v-timeline-item__divider .v-timeline-item__inner-dot {
  margin: 0px !important;
  height: 13px;
  width: 13px;
}
.card_text_pre {
  position: relative;
  top: 4px;
}
</style>