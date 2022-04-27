<template>
<v-navigation-drawer :width="isShow ? 590 : 0" right permanent fixed>
  <v-row class="d-flex justify-end ma-3">
    <v-btn fab small @click="close"><v-icon>mdi-close</v-icon></v-btn>
  </v-row>
  <RightEditor ref="rightEditor"/>
</v-navigation-drawer>
</template>
<script>
export default {
  name: 'RightKrEditor',
  components: {
    RightEditor: () => import('@/components/okrgoal/rightInfo/RightEditor.vue')
  },
  data() {
    return {
      isShow: false,
      data: null
    }
  },
  methods: {
    open(item) {
      this.isShow = true
      this.data = item
      this.$refs.rightEditor.open(item)
    },
    close() {
      this.isShow = false
    }
  }
}
</script>
