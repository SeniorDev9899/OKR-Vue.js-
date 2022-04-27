<template>
<v-container fluid>
  <v-card class="pa-5 mb-10" elevation="0" height="500">
    <span class="text-h6">OKR进度变化趋势图</span>
    <JSCharting :options="chartOptions"></JSCharting>
  </v-card>
</v-container>
</template>

<script>
import JSCharting from 'jscharting-vue';
export default {
  name: 'OkrTrendChart',
  components: {
    JSCharting
  },
  props: ["data"],
  computed: {
    points1: function() {
      let temp = []
      this.data.companyProgress.map(progress => {
        temp.push([progress.formatSet, progress.result/100])
      })
      return temp
    },
    points2: function() {
      let temp = []
      this.data.allProgress.map(progress => {
        temp.push([progress.formatSet, progress.result/100])
      })
      return temp
    },
    chartOptions: function() {
      return {
        debug: true,
        type: 'area',
        height: 350,
        legend_visible: false,
        yAxis: {
          formatString: 'p'
        },
        xAxis: {
          crosshair_enabled: true,
          scale: {
            type: 'time'
          }
        },
        defaultSeries: {
          shape_opacity: 0.3,
          defaultPoint_marker: {
            fill: 'white',
            type: 'circle',
            outline: {
              width: 2
            }
          }
        },
        series: [{
            name: 'Purchases',
            points: this.points1
          },
          {
            name: 'Rent',
            points: this.points2
          }
        ]
      }
    }
  },
  data() {
    return {
      
    }
  }
}
</script>
