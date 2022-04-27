<template>
<v-container fluid>
  <v-row class="justify-center">
    <v-col>
      <v-card elevation="0" min-width="500" height="250">
        <BarChart :data="points1" :title="title1" :palette="['gray', 'green']"/>
      </v-card>
    </v-col>
    <v-col>
      <v-card elevation="0" min-width="500" height="250">
        <BarChart :data="points2" :title="title2" :palette="['gray', 'green']"/>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import JSCharting from 'jscharting-vue';
export default {
  name: 'RateBar',
  components: {
    BarChart: () => import('@/components/common/BarChart.vue'),
    JSCharting
  },
  props: ['data1'],
  computed: {
    points1: function () {
      return [{
          x: '已对齐',
          y: this.data1[0]
        },
        {
          x: '未对齐',
          y: this.data1[1]
        },
      ]
    },
    points2: function () {
      return [{
          x: '已分解',
          y: this.data1[0]
        },
        {
          x: '未分解',
          y: this.data1[1]
        },
      ]
    }
  },
  data() {
    return {
      title1: 'OKR对齐量',
      title2: 'KR分解（E-执行）'
    }
  },
}
</script>
