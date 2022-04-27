<template>
<v-container class="pa-0" fluid>
  <ProjectBanner :filterMode="filterMode" />
  <!-- show mode buttons-->
  <v-row class="justify-end my-3 px-5">
    <v-spacer></v-spacer>
    <v-btn small @click="showMode='card'" elevation="0" :color="showMode=='card' ? 'primary' : ''" class="mx-2" rounded>
      卡片
    </v-btn>
    <v-btn small @click="showMode='table'" elevation="0" :color="showMode=='table' ? 'primary' : ''" class="mx-2" rounded>
      列表
    </v-btn>
    <!--
    <v-btn small @click="showMode='milestone'" elevation="0" :color="showMode=='milestone' ? 'primary' : ''" class="mx-2" rounded>
      显示里程碑
    </v-btn> -->
  </v-row>
  <!-- project card labels -->
  <v-row style="min-height:700px;" class="px-8 pb-9 pt-3 ma-3 blue-grey lighten-5">
    <v-container fluid>
      <v-row v-if="showMode=='card'">
        <v-col class="py-0">
          <span class="text-caption ml-1">负责人</span>
        </v-col>
        <v-col class="py-0" cols="3">
          <span class="text-caption ml-3">名称</span>
        </v-col>
        <v-col class="py-0" cols="1">
          <span class="text-caption">项目进度</span>
        </v-col>
        <v-col class="py-0">
          <span class="text-caption">起止日期</span>
        </v-col>
        <v-col class="py-0">
          <span class="text-caption">任务数</span>
        </v-col>
        <v-col class="py-0" cols="3">
          <span class="text-caption">参与成员</span>
        </v-col>
      </v-row>
      <!-- project card -->
      <v-row v-if="showMode=='card'" v-for="(item, i) in items" :key="i">
        <v-col class="py-1 px-0">
          <ProjectCard style="cursor:pointer;" @click.native="selectItem(item.item_id)" :item="item" />
        </v-col>
      </v-row>
      <!-- project table -->
      <v-row v-if="showMode=='table'">
        <ProjectTable :items="items" />
      </v-row>
    </v-container>
  </v-row>
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import {
  Routes
} from '@/constants/routes'
export default {
  name: 'ProjectContent',
  components: {
    ProjectBanner: () => import('@/components/project/ProjectBanner.vue'),
    ProjectCard: () => import('@/components/project/ProjectCard.vue'),
    ProjectTable: () => import('@/components/project/ProjectTable.vue'),
  },
  props: ['filterMode'],
  data: () => ({
    showMode: 'card',
  }),
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('item', ['items']),
    recents: function () {
      return this.authUser.user_recent_items
    }
  },
  methods: {
    ...mapActions('user', ['getUsers', 'updateUser']),
    ...mapActions('auth', ['updateUserInfo']),
    selectItem(id) {
      let recents = this.authUser.user_recent_items.split(',')
      if (recents[0] != id) {
        const index = recents.findIndex(recentItem => recentItem == id)
        if (index !== -1) {
          recents.splice(index, 1)
        }
        recents.unshift(id)
        this.updateUser({
          id: this.authUser.id,
          user_recent_items: recents.join()
        })
        this.updateUserInfo({
          user_recent_items: recents.join()
        })
      }
      this.$router.push({
        path: `${Routes.ITEM_DETAIL_PAGE}?id=${id}`
      })
    }
  },
  mounted() {
    this.getUsers()
    this.$emit('rendered')
  }
}
</script>
