<template>
<v-container fluid>
  <v-row class="justify-center">
    <!-- OKR fill rate -->
    <v-col>
      <v-card elevation="0" min-width="350" max-width="600" height="130">
        <v-container class="px-6">
          <v-row class="my-2 mx-4 py-2">
            <v-avatar size="30" color="#E3F2FD">
              <span class="blue--text font-weight-bold">O</span>
            </v-avatar>
            <span class="text-subtitle-1 ml-2">一周内未更新的O</span>
            <v-icon class="ml-2" small>mdi-information</v-icon>
          </v-row>
          <v-row class="pl-5">
            <span class="blue--text text-h6 ml-7">{{ noUpdatedMembers }}</span>
            <span class="text-h6">个</span>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <!-- OKR alignment rate -->
    <v-col>
      <v-card elevation="0" min-width="350" max-width="600" height="130">
        <v-container class="px-6">
          <v-row class="my-2 mx-4 py-2">
            <v-avatar size="30" color="#FFF3E0">
              <span class="orange--text font-weight-bold">KR</span>
            </v-avatar>
            <span class="text-subtitle-1 ml-2">一周内未更新的KR</span>
            <v-icon class="ml-2" small>mdi-information</v-icon>
          </v-row>
          <v-row class="pl-5">
            <span class="orange--text text-h6 ml-7">{{ noUpdatedKRs }}</span>
            <span class="text-h6">个</span>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
    <!-- Execution decomposition rate -->
    <v-col>
      <v-card elevation="0" min-width="350" max-width="600" height="130">
        <v-container class="px-6">
          <v-row class="my-2 mx-4 py-2">
            <v-avatar size="30" color="#E8F5E9">
              <span class="green--text font-weight-bold">E</span>
            </v-avatar>
            <span class="text-subtitle-1 ml-2">一周内未更新的E-执行</span>
            <v-icon class="ml-2" small>mdi-information</v-icon>
          </v-row>
          <v-row class="pl-5">
            <span class="green--text text-h6 ml-7">{{ noUpdatedExes }}</span>
            <span class="text-h6">个</span>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  name: 'TrackCards',
  props: ['dashTrack'],
  computed: {
    noUpdatedMembers: function() {
      return this.dashTrack ? this.dashTrack.trackValues[0] : 0
    },
    noUpdatedKRs: function() {
      return this.dashTrack ? this.dashTrack.trackValues[1] : 0
    },
    noUpdatedExes: function() {
      return this.dashTrack ? this.dashTrack.trackValues[2] : 0
    },
  }
}
</script>
