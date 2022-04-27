<template>
<v-container class="project-container" fluid>
  <v-row >
    <ProjectLeftbar v-if="renderedOrder==1"  @setMode="setMode"/>
    <v-col class="pa-0">
      <ProjectContent :filterMode="mode" @rendered="renderedOrder=1"/>
    </v-col> 
  </v-row>
</v-container>
</template>
<script>
export default {
  components: {
    ProjectLeftbar: () => import('@/components/project/ProjectLeftbar.vue'),
    ProjectContent: () => import('@/components/project/ProjectContent.vue')
  },
  data() {
    return {
      mode: 'company',
      renderedOrder: 0
    }
  },
  methods: {
    setMode(e) {
      this.mode = e
    }
  }
}
</script>
<style>
.project-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>