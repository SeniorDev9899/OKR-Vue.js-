<template>
<v-container fluid>
  <v-row class="justify-center">
    <v-col>
      <v-card elevation="0" min-width="500" height="400">
        <average-donut :data="points1" title="OKR整体平均完成度" :palette="['silver', 'cornflowerblue']" :value="Math.round(points1[1].y)"></average-donut>
      </v-card>
    </v-col>
    <v-col>
      <v-card elevation="0" min-width="500" height="400">
        <bar-chart :data="points2" title="各部门OKR平均完成度"></bar-chart>
      </v-card>
    </v-col>
  </v-row>
</v-container>

</template>
<script>
export default {
  name: 'OverallAverage',
  props: ['average', 'departAverage'],
  components: {
    AverageDonut: () => import ('@/components/okrdashboard/AverageDonut.vue'),
    BarChart: () => import ('@/components/common/BarChart.vue')
  },
  computed: {
    points1: function () {
      return [
        {
          name: '',
          y: 100-this.average
        },
        {
          name: '',
          y: this.average
        }
      ]      
    },
    points2: function () {
      let temp = []
      this.departAverage.map(data => {
        temp.push({
          name: data.formatSet,
          y: data.result
        })
      })
      return temp;
    }
  }
}
</script>