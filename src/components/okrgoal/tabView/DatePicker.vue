<template>
  <v-card>
    <v-tabs v-model="tab" icons-and-text>
      <v-tabs-slider></v-tabs-slider>
      <v-tab href="#tab-1">
        起此时间
      </v-tab>
      <v-tab href="#tab-2">
        长期
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item id="tab-1">
        <v-card flat>
          <v-card-text>This is 起此时间</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item id="tab-2">
        <v-card flat>
          <v-card-text>This is 长期</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      tab: null,
    };
  },
};
</script>
