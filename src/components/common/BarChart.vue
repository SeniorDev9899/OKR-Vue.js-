<template>
<v-container>
  <span class="text-h6">{{ title }}</span>
  <JSCharting class="mt-5" :options="chartOptions"></JSCharting>
</v-container>
</template>

<script>
import JSCharting from 'jscharting-vue';

export default {
  name: 'DonutChart',
  components: {
    JSCharting
  },
  props: ['data', 'title', 'palette'],
  computed: {
    chartOptions: function () {
      return {
        height: 300,
        type: 'horizontal column',
        series: [{
          points: this.data
        }],
        defaultSeries: {
          pointSelection: true,
          shape_innerSize: 120, 
          palette: this.palette
        },
      }
    }
  },
  data() {
    return {
    
    }
  }
}
</script>
