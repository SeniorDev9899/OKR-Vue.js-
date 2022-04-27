<template>
<v-container align-center justify-start d-flex class="right_progress_info h100">
  <v-layout align-center justify-start column class="h100">
    <v-flex class="w100">
      <v-sheet class="h100">
        <v-container align-center justify-start d-flex class="h100 p_0">
          <v-layout align-center justify-start column class="h100">
            <Operating ref="operator" :object_id="object_id" />
            <Intercom :object_id="object_id" @displayHiddenBtns="handle_displayHiddenBtns" :goal="Goal" />
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import Operating from '@/components/okrgoal/rightInfo/interactive/operating/Operating.vue';
import Intercom from '@/components/okrgoal/okrDetail/Interactive/Intercom.vue';

export default {
  name: 'InteractiveComponent',
  props: ['object_id', 'goal'],
  data() {
    return {
      Goal: null,
    }
  },
  created() {
    this.Goal = this.goal;
  },
  watch: {
    goal(v) {
      this.Goal = v;
    }
  },
  components: {
    Operating,
    Intercom,   
  },
  methods: {
    handle_displayHiddenBtns(prop) {
      this.$emit("displayHiddenBtns", prop);
    }
  }
}
</script>

<style scoped>
.right_progress_info {
  background-color: white;
  margin-top: 20px;
  padding-bottom: 0px !important;
}

.w100 {
  width: 100%;
}

.h100 {
  height: 100%;
}

.p_0 {
  padding: 0px !important;
}
</style>
