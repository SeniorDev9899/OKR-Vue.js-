<template>
  <v-app>
    <Header />
    <LeftBar />
    <v-main>
      <Notification />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import Notification from '@/components/common/Notification.vue';

export default {
  components: {
    Notification,
    LeftBar: () => import("@/components/common/LeftBar"),
    Header: () => import("@/components/common/Header"),
  },
  methods: {    
    handleToggleDrawer(smt) {
      this.drawer = smt;
    },
  },
};
</script>
<style>
</style>
