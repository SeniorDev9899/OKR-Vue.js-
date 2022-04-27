<template>
<v-container fluid>
  <v-row class="justify-center">
    <v-col>
      <v-card elevation="0" min-width="500" height="400">
        <DonutChart :data="points1" :title="title1" :palette="['gray', 'green', 'orange']"/>
      </v-card>
    </v-col>
    <v-col>
      <v-card elevation="0" min-width="500" height="400" >
        <DonutChart :data="points2" :title="title2" :palette="['gray', 'green', 'blue', 'orange']"/>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  name: 'RateCircleChart',
  components: {
    DonutChart: () => import('@/components/common/DonutChart.vue')
  },
  props: ['data1', 'data2'],
  computed: {
    points1: function () {
      return [{
          name: '未设置OKR',
          y: this.data1[1]
        },
        {
          name: '1-5个OKR',
          y: this.data1[2]
        },
        {
          name: '5个以上OKR',
          y: this.data1[3]
        },
      ]
    },
    points2: function() {
      return [{
          name: '未设置KR',
          y: this.data2[1]
        },
        {
          name: '1-2个KR',
          y: this.data2[2]
        },
        {
          name: '3-5个KR',
          y: this.data2[3]
        },
        {
          name: '5个以上KR',
          y: this.data2[4]
        }
      ]
    }
  },
  data() {
    return {
      title1: '每个人负责的目标 O 数量分布',
      title2: '目标 O 下的 KR 数量分布'
    }
  },
}
</script>
