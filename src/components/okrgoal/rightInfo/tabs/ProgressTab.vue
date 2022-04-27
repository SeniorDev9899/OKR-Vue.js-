<template>
<v-flex class="right_userInfo_layflex_tabs" @click="displayProgress">
  <v-sheet class="right_score_writesheet" :class="progressEnable && progress_note_btn ? 'right_score_writesheet_add_1' : ''">
    <v-icon :class="progressEnable && progress_note_btn ? 'r_icon_score' : 'r_icon_mesg'">mdi-notebook-edit-outline</v-icon>
    <span :class="progressEnable && progress_note_btn ? 'r_score_writedown' : 'right_message'">进展</span>
    <span :class="progressEnable && progress_note_btn ? 'r_score_writedown' : 'right_message'">( {{ length }} )</span>
  </v-sheet>
</v-flex>
</template>

<script>
export default {
  props: ['length', 'progressEnable'],
  data() {
    return {
      progress_note_btn: true,
    }
  },
  created() {
    this.progress_note_btn = true;
  },
  methods: {
    displayProgress() {
      this.progress_note_btn = true;
      this.$emit("displayProgress");
    }
  }
}
</script>

<style>
</style>
