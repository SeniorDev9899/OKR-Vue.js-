<template>
<v-container>
  <span class="text-h6 ma-2">{{ title }}</span>
  <JSCharting v-if="chartOptions" :options="chartOptions"></JSCharting>
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
        // toolbar_items_export_description: 'export menu',
        height: 350,
        description: 'Accessible %type chart with legend',
        title: {
          description: '%type chart with title %title',
          position: 'left',
          margin: '30 40 40 30'
        },
        legend: {
          description: 'legend with %pointcount entries',
          template: '{%percentOfTotal:n1}% %icon %name',
          position: 'inside bottom',
          defaultEntry: {
            description: '%name'
          }
        },
        defaultSeries: {
          type: 'pie donut',
          pointSelection: true,
          shape_innerSize: 90,
          palette: this.palette
        },
        defaultPoint: {
          label_text: '<b>%name</b>',
          description: '%name {%percentOfTotal:n1}%'
        },

        yAxis: {
          label_text: '',
          formatString: 'n'
        },
        series: [{
          name: '',
          points: this.data
        }]
      }
    },
  },
  data() {
    return {

    }
  },
}
</script>
