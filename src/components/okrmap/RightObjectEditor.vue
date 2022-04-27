<template>
<v-navigation-drawer :width="isShow ? 800 : 0" right permanent fixed :class="intercomInput && tabIndex == 3 ? 'ob_detail_content-sec' : 'ob_detail_content-fir'">
  <v-row class="d-flex justify-end ob_detail_header">
    <v-btn @click="goBack" v-if="objectList.length>1" text small><v-icon small>mdi-arrow-left</v-icon>返回</v-btn>
    <v-spacer></v-spacer>
    <v-btn fab small text @click="close"><v-icon small>mdi-close</v-icon></v-btn>
  </v-row>
  <OkrDetailComponent v-if="data" @select="selectObject" :object_id="objectList[objectList.length-1]" :tab_index="tabIndex" @interactiveTab="handle_interactiveTab" @displayHiddenBtns="handle_displayHiddenBtns" />
  <OkrAddIntercom v-if="data" :object_id="data.ob_id" :tab_index="tabIndex" :interactiveIcReplyIc="interactiveIcReplyIc" @addNewIntercom="handle_addNewIntercom" @closeInputWindow="handle_closeInputWindow" @openInputWindow="handle_openInputWindow" />
</v-navigation-drawer>
</template>

<script>
export default {
  name: 'RightObjectEditor',
  components:{
    OkrDetailComponent: () => import('@/components/okrmap/OkrDetailComponent.vue'),
    OkrAddIntercom: () => import('@/components/okrmap/OkrAddIntercom.vue'),
  },
  data() {
    return {
      isShow: false,
      data: null,
      interactiveIcReplyIc: null,
      tabIndex: 0,
      intercomInput: true,
      objectList: []
    }
  },
  methods: {
    open(item) {
      this.isShow = true
      this.data = item
      this.objectList = [item.ob_id]
    },
    close() {
      this.isShow = false
    },
    handle_interactiveTab(prop) {
      this.tabIndex = prop.index;
    },
    handle_displayHiddenBtns(prop) {
      this.interactiveIcReplyIc = prop;
    },
    handle_addNewIntercom() {
      this.tabIndex = 3;
      this.intercomInput = false;
    },
    handle_closeInputWindow() {
      this.intercomInput = false;
    },
    handle_openInputWindow() {
      this.intercomInput = true;
    },
    selectObject(e) {
      this.objectList.push(e)
    },
    goBack() {
      this.objectList.pop()
    }
  }
}
</script>

<style>
.ob_detail_header {
  width: 800px;
  height: 53px;
  position: fixed;
  right: 10px;
  border-bottom: 1px solid #dce6e8;
  background: white;
  z-index: 10;
  padding-top: 15px;
}
.ob_detail_content-fir .v-navigation-drawer__content {
  height: calc(100% - 48px) !important;
}
.ob_detail_content-sec .v-navigation-drawer__content {
  height: calc(100% - 208px) !important;
}
</style>
