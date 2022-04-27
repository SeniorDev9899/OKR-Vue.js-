<template>
<v-container v-if="data" fluid>
  <v-row class="justify-center">
    <!-- OKR fill rate -->
    <v-col>
      <v-card elevation="0" min-width="350" max-width="600" height="150">
        <v-container class="px-6">
          <v-row class="my-2 mx-4 font-weight-thin">
            <v-icon color="primary" class="mx-2">
              mdi-pencil-box-outline
            </v-icon>
            <span class="text-subtitle-1">OKR 填写率</span>
            <v-icon class="ml-2" small>mdi-information</v-icon>
          </v-row>
          <v-row>
            <span class="text-h6 mx-7">{{ Math.round(fillRate) }}%</span>
            <span v-if="Math.round(fillRateTrend)>0" class="text-caption blue--text pt-3 align-center"><v-icon class="pb-1" color="blue" small>mdi-arrow-up</v-icon> {{ Math.round(fillRateTrend) }}</span>
            <span v-if="Math.round(fillRateTrend)<0" class="text-caption red--text pt-3 align-center"><v-icon class="pb-1" color="red" small>mdi-arrow-down</v-icon> {{ Math.round(fillRateTrend) }}</span>
          </v-row>
          <v-row class="pa-3 mt-5">
            <v-progress-linear rounded height="12" v-model="fillRate"></v-progress-linear>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <!-- OKR alignment rate -->
    <v-col>
      <v-card elevation="0" min-width="350" max-width="600" height="150">
        <v-container class="px-6">
          <v-row class="my-2 mx-4 font-weight-thin">
            <v-icon color="orange" class="mx-2">
              mdi-format-vertical-align-top
            </v-icon>
            <span class="text-subtitle-1">OKR 对齐率</span>
            <v-icon class="ml-2" small>mdi-information</v-icon>
          </v-row>
          <v-row>
            <span class="text-h6 mx-7">{{ Math.round(alignmentRate) }}%</span>
            <span v-if="Math.round(alignmentRateTrend)>0" class="text-caption blue--text pt-3 align-center"><v-icon class="pb-1" color="blue" small>mdi-arrow-up</v-icon> {{ Math.round(alignmentRateTrend) }}</span>
            <span v-if="Math.round(alignmentRateTrend)<0" class="text-caption red--text pt-3 align-center"><v-icon class="pb-1" color="red" small>mdi-arrow-down</v-icon> {{ Math.round(alignmentRateTrend) }}</span>
          </v-row>
          <v-row class="pa-3 mt-5">
            <v-progress-linear color="orange" rounded height="12" v-model="alignmentRate"></v-progress-linear>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <!-- Execution decomposition rate -->
    <v-col>
      <v-card elevation="0" min-width="350" max-width="600" height="150">
        <v-container class="px-6">
          <v-row class="my-2 mx-4 font-weight-thin">
            <v-icon color="green" class="mx-2">
              mdi-lan
            </v-icon>
            <span class="text-subtitle-1">E-执行分解率</span>
            <v-icon class="ml-2" small>mdi-information</v-icon>
          </v-row>
          <v-row>
            <span class="text-h6 mx-7">{{ Math.round(executionRate) }}%</span>
            <span v-if="Math.round(executionRateTrend)>0" class="text-caption blue--text pt-3 align-center"><v-icon class="pb-1" color="blue" small>mdi-arrow-up</v-icon> {{ Math.round(executionRateTrend) }}</span>
            <span v-if="Math.round(executionRateTrend)<0" class="text-caption red--text pt-3 align-center"><v-icon class="pb-1" color="red" small>mdi-arrow-down</v-icon> {{ Math.round(executionRateTrend) }}</span>
          </v-row>
          <v-row class="pa-3 mt-5">
            <v-progress-linear color="green" rounded height="12" v-model="executionRate"></v-progress-linear>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  name: 'RateCards',
  computed: {
    fillRate: function () {
      return this.data[0]
    },
    fillRateTrend: function () {
      return this.data[1]
    },
    alignmentRate: function() {
      return this.data[2]
    },
    alignmentRateTrend: function() {
      return this.data[3]
    },
    executionRate: function() {
      return this.data[4]
    },
    executionRateTrend: function() {
      return this.data[5]
    }
  },
  props: ["data"]
}
</script>
