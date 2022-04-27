<template>
<v-container fluid>
  <v-row class="justify-center">
    <v-col>
      <v-card elevation="0" min-width="500" height="400">
        <average-donut :data="points1" :value="scoreCounts[0]" :palette="['gray', 'orange', 'green', 'blue']"></average-donut>
      </v-card>
    </v-col>
    <v-col>
      <v-card elevation="0" min-width="500" height="400">
        
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>
<script>
export default {
  name: 'OkrScore',
  components: {
    AverageDonut: () => import ('@/components/okrdashboard/AverageDonut.vue')
  },
  props: ['scoreCounts'],
  computed: {
    points1: function () {
      return [
        {
          name: '未评分',
          y: this.scoreCounts[1]
        },
        {
          name: '0-0.3分',
          y: this.scoreCounts[2]
        },
        {
          name: '0.4-0.7分',
          y: this.scoreCounts[3]
        },
        {
          name: '0.8-1分',
          y: this.scoreCounts[4]
        }
      ]
    }
  }
}
</script>