<template>
<v-dialog v-model="dialog" width="475px" overlay-opacity="0" overlay-color="white" content-class = "calendarDialog">
  <template v-slot:activator="{ on, attrs }">
    <!-- <v-sheet class="edit displayFlex" v-if = "pencil">
      <v-icon class="pencil" v-bind="attrs" v-on="on">
        mdi-grease-pencil
      </v-icon> -->
      <!-- <div class="edit_arrow"></div>
      <span class="editTooltip">编辑</span> -->
    <!-- </v-sheet> -->
  </template>
  <v-card class="calendarCard">
    <v-date-picker v-model="dates" color="green lighten-1" header-color="primary" width="475" type="date" year-icon="mdi-calendar-blank" prev-icon="mdi-skip-previous" next-icon="mdi-skip-next" range @change="handleDatePicker"></v-date-picker>
  </v-card>
</v-dialog>

</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      // pencil: false,
      dates: null,
    }
  },
  methods: {
    handleDatePicker() {
      this.$emit("changeDates", this.dates);
    },
    // displayCalendarPeriod() {
    //   this.dialog = true;
    //   this.pencil = true;
    // },
    open() {
      this.dialog = true;
    }
  }
}
</script>

<style>
.calendarDialog {
  box-shadow: none !important;
  height: 440px;
  position: absolute;
  right: 50px;
  margin: 0px;
  width: 400px;
}

.calendarCard {
  display: flex;
}

.edit {
  display: inline;
  align-items: center;
  justify-content: center;
}

.edit_arrow {
  position: relative;
  bottom: 15px;
  right: 12px;
  width: 0px;
  height: 0px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgb(100, 100, 100);
  opacity: 0;
  transition: all .3s ease;
}
.editTooltip {
  opacity: 0;
  position: relative;
  bottom: 29px;
  right: 38px;
  transition: all .3s ease;
  padding: 0px 7px;
}
.edit:hover .editTooltip {
  opacity: 1;
  background-color: rgb(100, 100, 100);
  border-radius: 3px;
}
.edit:hover .edit_arrow {
  opacity: 1 !important;
}
.calendarDialog_sec {
    box-shadow: none !important;
    height: 440px;
    position: relative;
    left: 30px;
    margin: 0px;
}
</style>
