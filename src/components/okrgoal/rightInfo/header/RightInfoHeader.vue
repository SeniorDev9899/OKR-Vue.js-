<template>
<v-system-bar height="50px" color="white">
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" md="8" sm="6" class="displayFlex">
        <v-icon size="20px" color="grey">
          mdi-timer-sand-empty
        </v-icon>
        <span class="right_header_name">未完成</span>
        <span class="right_header_name">(系统自动生成)</span>
      </v-col>
      <v-col cols="6" md="4" class="right_header_col">

        <ConfirmDialogComponent v-on:click="bool => confirmClick(bool)" :option="intercom"> 
          <ToolTipComponent
            direction="top"
            tooltipText="删除"
          >
            <div class="delete">
              <v-icon size="20" color="grey" class="delete_icon">
                mdi-delete-circle-outline
              </v-icon>
            </div>
          </ToolTipComponent>
        </ConfirmDialogComponent>

        <v-icon size="20" color="grey" class="close_rightSidebar" @click="closeNavigation">
          mdi-close
        </v-icon>
      </v-col>
    </v-row>
  </v-container>
</v-system-bar>
</template>

<script>
import ConfirmDialogComponent from "@/components/okrgoal/shared/ConfirmDialogComponent";
import ToolTipComponent from "@/components/okrgoal/shared/ToolTipComponent.vue";

export default {
  components: {
    ConfirmDialogComponent,
    ToolTipComponent,
  },
  data() {
    return {
      intercom: "intercom",
    }
  },
  methods: {
    closeNavigation() {
      this.$emit("closeRightNavigation");
    },
    confirmClick(prop) {
      this.$emit("deleteKrObject", prop);
    }
  }
}
</script>

<style>
.right_header_name {
  font-size: 16px;
  color: grey;
}

.right_header_col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.close_rightSidebar:hover {
  color: blue !important;
}

.delete_icon:hover {
  color: red !important;
  cursor: pointer;
}

.delete {
  display: inline;
  align-items: center;
  justify-content: center;
}

.delete_icon {
  font-size: 20px;
}

.delete:hover .delete_arrow {
  opacity: 1 !important;
}

.displayFlex {
  display: flex;
  align-items: center;
}
</style>
