<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" class="d-flex align-center mr-4">
        <span class="text mr-1" :class="size == 'small' && 'font-small'">{{
          text
        }}</span>
        <v-icon style="font-size: 18px;">
          mdi-chevron-down
        </v-icon>
      </span>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in dropdown"
        :key="index"
        @click="filterValue(item)"
      >
        {{ item }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "DropdownPopupComponent",
  props: ["text", "size", "dropdown"],
  data() {
    return {};
  },
  methods: {
    filterValue(param) {
      this.$emit("filterValue", param, "pick", {
        status: status,
      });
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 16px;
  font-weight: 500;
}

.font-small {
  font-size: 12px;
}

.v-list-item:hover {
  background-color: rgba(240, 242, 245, 0.3);
  color: rgb(40, 121, 255);
  cursor: pointer;
}
</style>
