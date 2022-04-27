<template>
  <v-app id="admin-container">
    <Header />
    <LeftBar />
    <v-main>
      <Notification text="Updated Successfully!" status="success" />
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
    LeftBar: () => import("@/components/admin/LeftBar"),
    Header: () => import("@/components/admin/Header"),
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
