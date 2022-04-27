<template>
  <v-layout>
    <v-flex v-for="(item, i) in tabs" :key = "i">
      <a
        class="tab-item"
        :class="activeTab == i && 'active'"
        @click="clickTab(i)"
      >
        <span class="tab-text">{{ item }}</span>
        <span class="underline"></span>
      </a>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "TabComponent",
  props: ["tabs", 'tab_index'],
  data() {
    return {
      activeTab: 0,
    };
  },
  watch: {
    tab_index(v) {
      this.activeTab = v;
    }
  },
  methods: {
    clickTab(index) {
      this.activeTab = index;
      this.$emit('clickTab', index)
    },
  },
};
</script>

<style scoped>
.tab-item {
  width: 65px;
  display: block;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  color: #667580;
  margin-bottom: -5px;
}

.tab-item:hover .underline {
  display: block;
  width: 30px;
  margin: 0 auto;
  border-bottom: 2px solid #c2e2f9;
}

.tab-text {
  display: block;
  margin-bottom: 5px;
}

.active .tab-text {
  color: #1d86f0;
}

.active .underline {
  display: block;
  width: 30px;
  margin: 0 auto;
  border-bottom: 2px solid #1d86f0;
}
</style>
