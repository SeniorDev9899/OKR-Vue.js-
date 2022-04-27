<template>
<v-banner color="#ECEFF1">
  <CreateProjectDlg @create="createItem" ref="createItemDlg" />
  <v-container fluid class="d-flex justify-start align-center">
    <span class="text-h6">{{ title }}</span>
    <v-spacer></v-spacer>
    <v-btn @click="openCreatDlg" color="primary">创建项目</v-btn>
  </v-container>
</v-banner>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { Routes } from '@/constants/routes'
export default {
  name: 'ProjectBanner',
  components: {
    CreateProjectDlg: () => import('@/components/common/CreateProjectDlg.vue')
  },
  props: ["filterMode"],
  computed: {
    ...mapGetters('auth', ['authUser']),
    title: function () {
      let title = ''
      switch ( this.filterMode ) {
        case 'recent':
          title = "最近查看"
          break;
        case  'owner':
          title = "我负责的"
          break;
        case 'participant':
          title = "我参与的"
          break;
        case 'follower':
          title = "我关注的"
          break;
        case 'company_visible':
          title = "所有公开的"
          break;
        case 'company':
          title = ""
          break;
      }
      return title
    }
  },
  methods: {
    ...mapActions('item', ['addItemCallback']),
    ...mapActions('auth', ['updateUserInfo']),
    ...mapActions('user', ['updateUser']),
    openCreatDlg() {
      this.$refs.createItemDlg.open()
    },
    createItem(item) {
      this.addItemCallback(item).then(res => {
        let recents = this.authUser.user_recent_items.split(',')
        recents.unshift(res.item_id)
        this.updateUser({
          id: this.authUser.id,
          user_recent_items: recents.join()
        })
        this.updateUserInfo({
          user_recent_items: recents.join()
        })
        this.$router.push({path: `${Routes.ITEM_DETAIL_PAGE}?id=${res.item_id}`})
      })
    }
  }
}
</script>
<style>

</style>