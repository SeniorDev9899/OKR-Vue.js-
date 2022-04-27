<template>
<v-container fluid>
  <!-- item banner -->
  <v-row>
    <ItemBanner @remove="deleteItem" @restart="restartItem" @complete="completeItem" @updateDate="updateItemDate" @addProgress="addNewProgress" @changeLabel="changeLabel" @removeLabel="removeLabel" :item="currentItem" />
  </v-row>
  <!-- tabs -->
  <v-row class="py-2 px-4">
    <v-tabs slider-size="5" v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab><span class="text-subtitle-1">计划</span></v-tab>
      <v-tab><span class="text-subtitle-1">里程碑</span></v-tab>
      <v-tab><span class="text-subtitle-1">看板</span></v-tab>
      <v-tab><span class="text-subtitle-1">动态</span></v-tab>
      <v-tab><span class="text-subtitle-1">甘特图</span></v-tab>
      <v-tab><span class="text-subtitle-1">统计</span></v-tab>
      <v-tab><span class="text-subtitle-1">进度</span></v-tab>
      <v-tab><span class="text-subtitle-1">成员</span></v-tab>
      <!-- <v-tab><span class="text-subtitle-1">外部成员</span></v-tab> -->
      <v-tab><span class="text-subtitle-1">互动</span></v-tab>
      <v-tab><span class="text-subtitle-1">基本信息</span></v-tab>
      <!-- <v-tab><span class="text-subtitle-1">审批</span></v-tab>
      <v-tab><span class="text-subtitle-1">文件</span></v-tab> -->
    </v-tabs>
    <!-- tab items -->
    <v-tabs-items v-model="tab">
      <!-- item plan -->
      <v-tab-item>
        <ItemPlan :item="currentItem" />
      </v-tab-item>
      <!-- item milestone -->
      <v-tab-item>
        <ItemMilestone @selectTask="selectTask" />
      </v-tab-item>
      <!-- item Kanban -->
      <v-tab-item>
        <ItemKanban @selectTask="selectTask"/>
      </v-tab-item>
      <!-- item dynamic -->
      <v-tab-item>
        <ItemDynamic />
      </v-tab-item>
      <!-- gantt chart -->
      <v-tab-item>
        <GanttChart />
      </v-tab-item>
      <!-- item statistics -->
      <v-tab-item>
        <ItemStatistics :item="currentItem"/>
      </v-tab-item>
      <!-- item schedule -->
      <v-tab-item>
        <ItemSchedule :item="currentItem" />
      </v-tab-item>
      <!-- item member -->
      <v-tab-item>
        <ItemMember :item="currentItem" />
      </v-tab-item>
      <!-- item external member -->
      <!-- <v-tab-item>
        <ItemExternalMember/>
      </v-tab-item> -->
      <!-- item interactive -->
      <v-tab-item>
        <ItemInteractive :item="currentItem" />
      </v-tab-item>
      <!-- item basic information -->
      <v-tab-item>
        <ItemBasicInfo :item="currentItem" />
      </v-tab-item>
      <!-- item approve -->
      <!-- <v-tab-item>
        <ItemApprove/>
      </v-tab-item> -->
      <!-- item file -->
      <!-- <v-tab-item>
        <ItemFile/>
      </v-tab-item> -->
    </v-tabs-items>
  </v-row>
  <RightTaskEditor ref="rightTaskEditor"/>
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import { Routes } from '@/constants/routes'
import RightTaskEditor from '@/components/common/taskEdit/TaskEdit.vue'
export default {
  components: {
    ItemBanner: () => import('@/components/itemDetail/ItemBanner.vue'),
    ItemPlan: () => import('@/components/itemDetail/ItemPlan.vue'),
    ItemMilestone: () => import('@/components/itemDetail/ItemMilestone.vue'),
    ItemKanban: () => import('@/components/itemDetail/ItemKanban.vue'),
    ItemDynamic: () => import('@/components/itemDetail/ItemDynamic.vue'),
    GanttChart: () => import('@/components/itemDetail/GanttChart.vue'),
    ItemStatistics: () => import('@/components/itemDetail/ItemStatistics.vue'),
    ItemSchedule: () => import('@/components/itemDetail/ItemSchedule.vue'),
    ItemMember: () => import('@/components/itemDetail/ItemMember.vue'),
    ItemExternalMember: () => import('@/components/itemDetail/ItemExternalMember.vue'),
    ItemInteractive: () => import('@/components/itemDetail/ItemInteractive.vue'),
    ItemBasicInfo: () => import('@/components/itemDetail/ItemBasicInfo.vue'),
    ItemApprove: () => import('@/components/itemDetail/ItemApprove.vue'),
    ItemFile: () => import('@/components/itemDetail/ItemFile.vue'),
    RightTaskEditor,
  },
  computed: {
    ...mapGetters('item', ['items']),
    currentItem: function () {
      return this.items[0]
    }
  },
  data: () => ({
    itemName: null,
    tab: null
  }),
  methods: {
    ...mapActions('item', ['getItems', 'updateItemByField', 'removeItem']),
    ...mapActions('user', ['getUsers']),
    ...mapActions('dashboard', ['getItemStatistics']),
    ...mapActions('progress', ['addProgressCallback']),
    changeLabel(e) {
      let itemTag = this.currentItem.item_tag.split(',')
      itemTag.push(e)
      this.updateItemByField({
        item_id: this.currentItem.item_id,
        item_tag: itemTag.join()
      })
    },
    removeLabel(id) {
      let itemTag = this.currentItem.item_tag.split(',')
      const index = itemTag.findIndex(tag => tag == id)
      itemTag.splice(index, 1)
      this.updateItemByField({
        item_id: this.currentItem.item_id,
        item_tag: itemTag.join()
      })
    },
    addNewProgress(e) {
      this.addProgressCallback(e).then(() => {
        this.getItems({
          item_id: this.$route.query.id
        })
      })
    },
    updateItemDate(e) {
      this.updateItemByField(e)
    },
    completeItem() {
      this.updateItemByField({
        item_id: this.currentItem.item_id,
        item_status: 1
      })
    },
    restartItem() {
      this.updateItemByField({
        item_id: this.currentItem.item_id,
        item_status: 0
      })
    },
    deleteItem() {
      this.$router.push({path: Routes.EXE_PROJECT_PAGE})
      this.removeItem({item_id: this.currentItem.item_id})
    },
    selectTask(e) {
      this.$refs.rightTaskEditor.openTaskEditor({task_id: e})
    }
  },
  mounted() {
    this.getItems({
      item_id: this.$route.query.id
    })
    this.getUsers()
    this.getItemStatistics({"req_item_id": 500539352});
    // this.getItemStatistics({"req_item_id": this.item.item_id});
  }
}
</script>

<style scoped>
.v-tabs-items {
  width: 100%;
}
</style>
