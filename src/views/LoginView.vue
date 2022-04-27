<template>
  <v-main id="auth">
    <Notification />
    <router-view />
  </v-main>
</template>

<script>
import Notification from '@/components/common/Notification.vue';
export default {
  props: {},
  components: {
    Notification,
  },
  created() {},
};
</script>

<style>
#auth {
  height: 100% !important;
  width: 100% !important;
}
</style>
